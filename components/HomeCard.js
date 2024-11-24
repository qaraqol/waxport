"use client";
import { Card, Input, Button, Select, Table, Space, Checkbox } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

const HomeCard = ({
  searchValue,
  setSearchValue,
  handleSearch,
  advancedFilters,
  setAdvancedFilters,
}) => {
  const [advancedMode, setAdvancedMode] = useState(false);

  // Dynamic columns based on mode
  const columns = advancedMode
    ? [
        {
          title: "Sender",
          dataIndex: "sender",
          key: "sender",
          render: () => (
            <Input
              placeholder="Sender"
              value={advancedFilters.from || ""}
              onChange={(e) =>
                setAdvancedFilters((prev) => ({
                  ...prev,
                  from: e.target.value,
                  account: e.target.value,
                }))
              }
            />
          ),
        },
        {
          title: "Receiver",
          dataIndex: "receiver",
          key: "receiver",
          render: () => (
            <Input
              placeholder="Receiver"
              value={advancedFilters.to || ""}
              onChange={(e) =>
                setAdvancedFilters((prev) => ({
                  ...prev,
                  to: e.target.value,
                }))
              }
            />
          ),
        },
        {
          title: "Token Symbol",
          dataIndex: "token",
          key: "token",
          render: () => (
            <Input
              placeholder="i.e. wax"
              value={advancedFilters.symcode || ""}
              onChange={(e) =>
                setAdvancedFilters((prev) => ({
                  ...prev,
                  symcode: e.target.value,
                }))
              }
            />
          ),
        },
      ]
    : [
        {
          title: "WAX Address",
          dataIndex: "address",
          key: "address",
          render: () => (
            <Input
              placeholder="Enter WAX Address"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
            />
          ),
        },
        {
          title: "Transactions",
          dataIndex: "transactions",
          key: "transactions",
          render: () => (
            <Select defaultValue="Transfers" style={{ width: "100%" }} disabled>
              <Option value="Transfers">Transfers</Option>
            </Select>
          ),
        },
        {
          title: "Transfer Type",
          dataIndex: "transferType",
          key: "transferType",
          render: () => (
            <Select
              defaultValue="All Transfers"
              style={{ width: "100%" }}
              onChange={(value) =>
                setAdvancedFilters((prev) => ({ ...prev, transferType: value }))
              }
            >
              <Option value="Inbound">Inbound</Option>
              <Option value="Outbound">Outbound</Option>
              <Option value="All Transfers">All Transfers</Option>
            </Select>
          ),
        },
      ];

  // Dynamic data source based on mode
  const dataSource = advancedMode
    ? [
        {
          key: "1",
          sender: advancedFilters.sender || "",
          receiver: advancedFilters.receiver || "",
          token: advancedFilters.token || "",
        },
      ]
    : [
        {
          key: "1",
          address: searchValue,
          transactions: "Transfers",
          transferType: advancedFilters.transferType || "All Transfers",
        },
      ];

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>Search & Export Transaction History</span>
        </div>
      }
      style={{
        width: "40vw",
        height: "auto",
        boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.15)",
        borderRadius: "25px",
      }}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        style={{ marginBottom: "16px" }}
      />
      <Checkbox
        checked={advancedMode}
        onChange={(e) => setAdvancedMode(e.target.checked)}
        style={{ marginBottom: "16px" }}
      >
        Enable Advanced Mode
      </Checkbox>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Button icon={<UploadOutlined />} disabled>
          Upload CSV
        </Button>
        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
          Search
        </Button>
      </Space>
    </Card>
  );
};

export default HomeCard;
