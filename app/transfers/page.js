import { Suspense } from "react";
import { Spin } from "antd";
import TransfersPage from "./TransfersPage";

export default function TransfersPageWrapper() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin tip="Loading.." size="large" />
        </div>
      }
    >
      <TransfersPage />
    </Suspense>
  );
}
