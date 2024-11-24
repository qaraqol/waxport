"use client";
import { useState, useEffect, Suspense } from "react";
import {
  ConfigProvider,
  Table,
  Button,
  Select,
  Row,
  Col,
  Space,
  Typography,
} from "antd";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

// Separate component for the content that uses useSearchParams
const TransfersContent = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [downloadCount, setDownloadCount] = useState(25);
  const [totalResults, setTotalResults] = useState(0);
  const [apiError, setApiError] = useState(false);

  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  if (params.transferType == "Inbound") params.to = params.account;
  if (params.transferType == "Outbound") params.from = params.account;

  useEffect(() => {
    if (params.account) {
      fetchData(params, pagination.current);
    } else {
      router.push("/");
    }
  }, [params.account, pagination.current]);

  const fetchData = async (params, page) => {
    setLoading(true);
    setApiError(false);
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`/api/transfers?${query}&page=${page}`);
      const result = await response.json();
      if (result.ok !== true) {
        setApiError(true);
        setData([]);
        setTotalResults(0);
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
        return;
      }

      const totalResults = result.meta?.total_results || 0;

      setData(result.data || []);
      setPagination((prev) => ({
        ...prev,
        total: totalResults,
      }));
      setTotalResults(totalResults);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
    }));
  };

  const handleDownloadCSV = () => {
    // Generate a unique timestamp to avoid static generation issues
    const timestamp = Date.now();
    const query = new URLSearchParams({
      ...params,
      rows: downloadCount,
      _t: timestamp, // Add timestamp to make each request unique
    }).toString();

    window.open(`/api/download-csv?${query}`, "_blank");
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Transaction ID",
      key: "trx_id",
      dataIndex: "trx_id",
      render: (trx) => (
        <a
          href={`https://waxblock.io/transaction/${trx}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {trx.slice(0, 5)}...
        </a>
      ),
    },
    { title: "From", dataIndex: "from", key: "from" },
    { title: "To", dataIndex: "to", key: "to" },
    { title: "Token", dataIndex: "symcode", key: "symcode" },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => {
        const [integer, decimal] = quantity.split(".");
        return decimal ? `${integer}.${decimal.slice(0, 2)}` : integer;
      },
    },
    { title: "Memo", dataIndex: "memo", key: "memo" },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const downloadOptions = [
    { value: 25, label: "25 Transactions" },
    { value: 50, label: "50 Transactions" },
    { value: 100, label: "100 Transactions" },
    { value: 250, label: "250 Transactions" },
    { value: 500, label: "500 Transactions" },
    { value: 1000, label: "1000 Transactions" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "16px" }}
      >
        <Col>
          <Title level={1}>
            Transfers for {params.account || "Unknown Account"}
          </Title>
        </Col>
        <Col>
          <Space>
            <Select
              value={downloadCount}
              onChange={setDownloadCount}
              options={downloadOptions}
              style={{ width: 150 }}
              disabled={apiError}
            />
            <Button
              type="primary"
              onClick={handleDownloadCSV}
              disabled={apiError}
            >
              Download CSV
            </Button>
          </Space>
        </Col>
      </Row>

      {apiError && (
        <Row style={{ marginBottom: "16px" }}>
          <Col>
            <Text
              type="danger"
              style={{ fontSize: "16px", fontWeight: "bold" }}
            >
              API Error or Invalid Account
            </Text>
          </Col>
        </Row>
      )}

      {!apiError && (
        <Row justify="start" style={{ marginBottom: "16px" }}>
          <Col>
            <Text strong style={{ fontSize: "16px" }}>
              Total Results: {totalResults}
            </Text>
          </Col>
        </Row>
      )}

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.trx_id}-${record.action_index}`}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ padding: "24px" }}>
    <Title level={1}>Loading transfers...</Title>
  </div>
);

// Main component wrapped with Suspense
const TransfersPage = () => {
  return (
    <ConfigProvider>
      <Suspense fallback={<LoadingFallback />}>
        <TransfersContent />
      </Suspense>
    </ConfigProvider>
  );
};

export default TransfersPage;
