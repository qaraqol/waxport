"use client";
import React from "react";
import { Card, Typography, List } from "antd";

const { Title, Text } = Typography;

const FAQCard = () => {
  const faqData = [
    {
      question: "What is waxport?",
      answer: (
        <>
          <Text>
            <b>waxport</b> is a tool designed to export WAX blockchain transfer
            history into a CSV file. This allows you to easily track, analyze,
            and manage transactions for accounting, tax purposes, or personal
            records.
          </Text>
        </>
      ),
    },
    {
      question: "What data does waxport export?",
      answer: (
        <List
          dataSource={[
            "Date and Time of the transaction (UTC)",
            "Transaction ID",
            "Sender and Recipient addresses",
            "Amount transferred",
            "Memo",
            "Transaction Status",
          ]}
          renderItem={(item) => (
            <List.Item>
              •<b> {item}</b>
            </List.Item>
          )}
        />
      ),
    },
    {
      question: "Does waxport support multiple accounts?",
      answer: (
        <Text>
          You can export transfers for one account at a time. To export data for
          multiple accounts, repeat the export process for each account
          separately.
        </Text>
      ),
    },
    {
      question: "How do I use waxport to export my WAX transfers?",
      answer: (
        <List
          dataSource={[
            "Enter your WAX account name.",
            "Select how many transactions you want to export.",
            'Click on "Export": The tool will process your request and generate a CSV file.',
            "Download the CSV file: Save the file to your device when prompted.",
          ]}
          renderItem={(item) => <List.Item>• {item}</List.Item>}
        />
      ),
    },
    {
      question: "Advanced Options",
      answer: (
        <Text>
          For advanced users, we provide an option to filter transactions based
          on a specified token symbol and sender/receiver accounts.
        </Text>
      ),
    },
  ];

  return (
    <>
      &nbsp;
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
            <span>Frequently Asked Questions</span>
          </div>
        }
        style={{
          width: "40vw",
          padding: "20px",
          boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.15)",
          borderRadius: "25px",
        }}
      >
        <List
          dataSource={faqData}
          renderItem={(faq) => (
            <List.Item>
              <div style={{ marginBottom: "16px" }}>
                <Title level={5} style={{ marginBottom: "8px" }}>
                  {faq.question}
                </Title>
                {faq.answer}
              </div>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default FAQCard;
