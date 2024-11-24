"use client";
import { Layout, Row, Col } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeCard from "@/components/HomeCard";

const { Content } = Layout;

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({});
  const router = useRouter();

  const handleSearch = () => {
    if (
      searchValue.trim() ||
      Object.keys(advancedFilters).some((key) => advancedFilters[key]?.trim())
    ) {
      const queryParams = new URLSearchParams({
        ...(searchValue && { account: searchValue }),
        ...advancedFilters,
      }).toString();
      router.push(`/transfers?${queryParams}`);
    }
  };

  return (
    <>
      <Content style={{ padding: "0 20px" }}>
        <Row
          justify="center"
          align="middle"
          style={{
            marginTop: "40px", // Add space between header and the card
            height: "auto", // Ensures content fills the screen below the header
          }}
        >
          <Col>
            <HomeCard
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleSearch={handleSearch}
              advancedFilters={advancedFilters}
              setAdvancedFilters={setAdvancedFilters}
            />
          </Col>
        </Row>
      </Content>
    </>
  );
}
