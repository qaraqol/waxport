"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Space,
  Typography,
  InputNumber,
  Spin,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const { Title, Text } = Typography;

const TransfersPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [apiError, setApiError] = useState(false);
  const [range, setRange] = useState([1, 2]);

  // Parse and prepare search parameters
  const params = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // Modify params based on transfer type
  if (params.transferType === "Inbound") params.to = params.account;
  if (params.transferType === "Outbound") params.from = params.account;

  // Start page change handler
  const handleStartPageChange = (value) => {
    if (value === null) return;
    const startPage = Math.max(1, Math.min(value, totalPages));
    const endPage = Math.min(
      Math.max(range[1], startPage),
      startPage + 39,
      totalPages
    );
    setRange([startPage, endPage]);
  };

  // End page change handler
  const handleEndPageChange = (value) => {
    if (value === null) return;
    const endPage = Math.max(
      range[0],
      Math.min(value, range[0] + 39, totalPages)
    );
    if (endPage < range[0]) {
      return;
    }
    setRange([range[0], endPage]);
  };

  // Fetch data effect
  useEffect(() => {
    if (params.account) {
      fetchData(params, pagination.current);
    } else {
      router.push("/");
    }
  }, [params.account, pagination.current]);

  // Fetch data function
  const fetchData = async (params, page) => {
    setLoading(true);
    setApiError(false);
    try {
      const query = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v != null)
      ).toString();
      const response = await fetch(`/api/transfers?${query}&page=${page}`);
      const result = await response.json();

      if (result.ok !== true) {
        setApiError(true);
        setData([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
        return;
      }

      const totalResults = result.meta?.total_results || 0;
      const totalPages = Math.ceil(totalResults / 50);

      setData(result.data || []);
      setPagination((prev) => ({
        ...prev,
        total: totalResults,
      }));
      setTotalPages(totalPages);
      setRange([1, Math.min(totalPages, 30)]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  // Table change handler
  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
    }));
  };

  // CSV Download handler
  const handleDownloadCSV = () => {
    if (
      range[0] < 1 ||
      range[1] < range[0] ||
      range[1] > Math.min(totalPages, 100)
    ) {
      alert("Invalid page range selected. Please try again.");
      return;
    }

    const downloadParams = {
      ...params,
      startPage: range[0].toString(),
      endPage: range[1].toString(),
    };

    const query = new URLSearchParams(
      Object.entries(downloadParams).filter(([_, v]) => v != null)
    ).toString();

    const csvUrl = `/api/download-csv?${query}`;
    window.open(csvUrl, "_blank");
  };

  return (
    <div style={{ padding: "24px", width: "75vw" }}>
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
          <Space direction="horizontal">
            <InputNumber
              addonBefore="Starting Page"
              min={1}
              max={totalPages}
              value={range[0]}
              onChange={handleStartPageChange}
              disabled={apiError}
              placeholder="Start Page"
            />
            <InputNumber
              addonBefore="Ending Page"
              min={range[0]}
              max={Math.min(range[0] + 30, totalPages)}
              value={range[1]}
              onChange={handleEndPageChange}
              disabled={apiError}
              placeholder="End Page"
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
              Total Pages: {totalPages} (Max Downloadable: 30)
            </Text>
          </Col>
        </Row>
      )}
      <Table
        columns={[
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
        ]}
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

export default TransfersPage;
