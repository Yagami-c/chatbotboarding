import React, { useState } from "react";
import { PermissionStatus } from "../types";

interface Props {
  show: boolean;
  type: "bluetooth" | "location" | "both";
  onRequest: (type: "bluetooth" | "location") => Promise<boolean>;
  onCancel: () => void;
}

export function PermissionRequest({ show, type, onRequest, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!show) return null;

  const isBluetooth = type === "bluetooth" || type === "both";
  const isLocation = type === "location" || type === "both";

  const handleRequest = async (reqType: "bluetooth" | "location") => {
    setLoading(true);
    setFailed(false);
    try {
      const result = await onRequest(reqType);
      if (!result) {
        setFailed(true);
      }
    } catch (e) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSettings = () => {
    if (typeof window !== "undefined" && window.location) {
      alert("请在系统设置 > 应用 > 本应用 中启用所需权限");
    }
  };

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "320px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#333" }}>
          {type === "both" ? "申请必要权限" : isBluetooth ? "申请蓝牙权限" : "申请定位权限"}
        </h3>

        <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#666", lineHeight: 1.6 }}>
          {type === "both"
            ? "为了正常使用设备，需要以下权限："
            : isBluetooth
            ? "应用需要蓝牙权限来连接您的设备。"
            : "蓝牙扫描需要定位权限（这是系统要求，不会使用您的位置信息）。"}
        </p>

        {isBluetooth && (
          <div style={{
            background: "#fff3cd",
            borderLeft: "4px solid #ffc107",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "12px",
            fontSize: "13px",
            color: "#856404",
            lineHeight: 1.5,
          }}>
            📱 蓝牙权限：用于连接和控制您的设备。
          </div>
        )}

        {isLocation && (
          <div style={{
            background: "#fff3cd",
            borderLeft: "4px solid #ffc107",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "12px",
            fontSize: "13px",
            color: "#856404",
            lineHeight: 1.5,
          }}>
            📍 定位权限：系统要求用于蓝牙扫描，不会记录或使用您的位置。
          </div>
        )}

        {failed && (
          <div style={{
            background: "#f8d7da",
            borderLeft: "4px solid #f5c6cb",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "12px",
            fontSize: "13px",
            color: "#721c24",
            lineHeight: 1.5,
          }}>
            ❌ 权限申请失败。请在系统设置中手动启用权限。
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              background: "#f0f0f0",
              color: "#333",
              fontWeight: "bold",
              opacity: loading ? 0.5 : 1,
            }}
          >
            稍后
          </button>
          {failed ? (
            <button
              onClick={handleOpenSettings}
              style={{
                flex: 1,
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                background: "#667eea",
                color: "white",
                fontWeight: "bold",
              }}
            >
              打开设置
            </button>
          ) : (
            <button
              onClick={() => {
                if (isBluetooth) handleRequest("bluetooth");
                if (!isBluetooth && isLocation) handleRequest("location");
              }}
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                background: "#667eea",
                color: "white",
                fontWeight: "bold",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "申请中..." : "允许"}
            </button>
          )}
        </div>

        <div style={{ marginTop: "16px", fontSize: "12px", color: "#999", textAlign: "center", lineHeight: 1.5 }}>
          您可以随时在系统设置中更改权限设置。
        </div>
      </div>
    </div>
  );
}
