import React, { useState, useEffect } from "react";
import { BluetoothConnectState, PermissionStatus, BluetoothDevice } from "../types";

interface Props {
  state: BluetoothConnectState;
  permissions: PermissionStatus;
  pairedDevices: BluetoothDevice[];
  connectedDevice?: BluetoothDevice;
  scannedDevices?: BluetoothDevice[];
  onPermissionRequest: (type: "bluetooth" | "location") => void;
  onScan: () => void;
  onPair: (device: BluetoothDevice) => void;
  onConnect: (device: BluetoothDevice) => void;
  onCancel: () => void;
}

export function BluetoothConfigWizard({
  state,
  permissions,
  pairedDevices,
  connectedDevice,
  scannedDevices = [],
  onPermissionRequest,
  onScan,
  onPair,
  onConnect,
  onCancel,
}: Props) {
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(null);

  const isStep1 = state === "not_configured" || state === "permission_needed" || state === "checking_permission";
  const isStep2 = state === "scanning";
  const isStep3 = state === "pairing";
  const isStep4 = state === "connecting" || state === "verifying";

  return (
    <div style={{
      padding: "20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "12px",
      color: "#fff",
      minHeight: "300px",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Step 1: 权限检查 */}
        {isStep1 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#fff",
                color: "#667eea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}>1</div>
              <div>申请必要权限</div>
            </div>
            <p style={{ margin: "0 0 16px 0", fontSize: "14px", opacity: 0.9, lineHeight: 1.5 }}>
              设备连接需要蓝牙和定位权限（用于蓝牙扫描）
            </p>

            {permissions.bluetooth === "denied" ? (
              <div style={{
                background: "rgba(255, 87, 87, 0.2)",
                borderLeft: "4px solid #ff5757",
                padding: "12px",
                borderRadius: "4px",
                margin: "12px 0",
                fontSize: "13px",
                lineHeight: 1.5,
              }}>
                ❌ 蓝牙权限被拒绝。请在系统设置中允许蓝牙权限。
              </div>
            ) : permissions.bluetooth !== "granted" ? (
              <button
                onClick={() => onPermissionRequest("bluetooth")}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  background: "#fff",
                  color: "#667eea",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                }}
              >
                申请蓝牙权限
              </button>
            ) : (
              <div style={{
                background: "rgba(76, 175, 80, 0.2)",
                borderLeft: "4px solid #4caf50",
                padding: "12px",
                borderRadius: "4px",
                margin: "12px 0",
                fontSize: "13px",
                lineHeight: 1.5,
              }}>
                ✓ 蓝牙权限已获取
              </div>
            )}

            {permissions.location === "denied" ? (
              <div style={{
                background: "rgba(255, 87, 87, 0.2)",
                borderLeft: "4px solid #ff5757",
                padding: "12px",
                borderRadius: "4px",
                margin: "12px 0",
                fontSize: "13px",
                lineHeight: 1.5,
              }}>
                ❌ 定位权限被拒绝。蓝牙扫描需要此权限。请在系统设置中允许。
              </div>
            ) : permissions.location !== "granted" ? (
              <button
                onClick={() => onPermissionRequest("location")}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  fontWeight: "bold",
                  marginTop: 12,
                }}
              >
                申请定位权限
              </button>
            ) : (
              <div style={{
                background: "rgba(76, 175, 80, 0.2)",
                borderLeft: "4px solid #4caf50",
                padding: "12px",
                borderRadius: "4px",
                margin: "12px 8px 0 0",
                fontSize: "13px",
                lineHeight: 1.5,
              }}>
                ✓ 定位权限已获取
              </div>
            )}
          </>
        )}

        {/* Step 2: 扫描设备 */}
        {isStep2 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}>2</div>
              <div>扫描设备</div>
            </div>
            <p style={{ margin: "0 0 16px 0", fontSize: "14px", opacity: 0.9, lineHeight: 1.5 }}>
              正在搜索附近的设备...
            </p>

            {scannedDevices.length > 0 ? (
              <>
                <p style={{ margin: "8px 0", fontSize: "14px" }}>
                  找到 {scannedDevices.length} 个设备：
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "12px 0" }}>
                  {scannedDevices.map((dev) => (
                    <button
                      key={dev.address}
                      onClick={() => setSelectedDevice(dev)}
                      style={{
                        padding: "12px",
                        background: selectedDevice?.address === dev.address ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                        border: selectedDevice?.address === dev.address ? "2px solid #fff" : "2px solid transparent",
                        borderRadius: "8px",
                        color: "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{dev.name}</div>
                      <div style={{ fontSize: "12px", opacity: 0.8 }}>
                        地址: {dev.address} | 信号强度: {dev.rssi || "-"}dBm
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ margin: "12px 0", fontSize: "14px" }}>
                未找到设备。请确保设备已打开并在蓝牙范围内。
              </p>
            )}
          </>
        )}

        {/* Step 3: 配对 */}
        {isStep3 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}>3</div>
              <div>配对设备</div>
            </div>
            {selectedDevice ? (
              <>
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", opacity: 0.9, lineHeight: 1.5 }}>
                  正在与 <strong>{selectedDevice.name}</strong> 配对...
                </p>
                <p style={{ margin: "12px 0 0 0", fontSize: "12px", opacity: 0.7 }}>
                  请在设备端确认配对请求。
                </p>
              </>
            ) : (
              <p style={{ color: "#ffcccc", fontSize: "14px" }}>
                ⚠️ 请先选择要配对的设备
              </p>
            )}
          </>
        )}

        {/* Step 4: 验证连接 */}
        {isStep4 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}>4</div>
              <div>验证连接</div>
            </div>
            <p style={{ margin: "0 0 16px 0", fontSize: "14px", opacity: 0.9, lineHeight: 1.5 }}>
              正在验证设备连接...
            </p>
            <p style={{ margin: "12px 0 0 0", fontSize: "12px", opacity: 0.7 }}>
              请保持设备打开且靠近手机。
            </p>
          </>
        )}

        {/* 错误处理 */}
        {(state === "permission_denied" || state === "connection_failed" || state === "pairing_failed" || state === "timeout") && (
          <div style={{
            background: "rgba(255, 87, 87, 0.2)",
            borderLeft: "4px solid #ff5757",
            padding: "12px",
            borderRadius: "4px",
            marginTop: "12px",
            fontSize: "13px",
            lineHeight: 1.5,
          }}>
            {state === "permission_denied" && "❌ 权限申请被拒绝。请在系统设置中允许权限。"}
            {state === "connection_failed" && "❌ 连接失败。请检查设备状态并重试。"}
            {state === "pairing_failed" && "❌ 配对失败。请检查设备并重试。"}
            {state === "timeout" && "❌ 连接超时。请确保设备在蓝牙范围内并重试。"}
          </div>
        )}

        {/* 已连接 */}
        {state === "connected" && connectedDevice && (
          <div style={{
            background: "rgba(76, 175, 80, 0.2)",
            borderLeft: "4px solid #4caf50",
            padding: "12px",
            borderRadius: "4px",
            marginTop: "12px",
            fontSize: "13px",
            lineHeight: 1.5,
          }}>
            ✓ 已连接到 <strong>{connectedDevice.name}</strong>（{connectedDevice.address}）
          </div>
        )}
      </div>

      {/* 按钮 */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px" }}>
        {state !== "connected" && (
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            取消
          </button>
        )}
        {state === "scanning" && selectedDevice && (
          <button
            onClick={() => onPair(selectedDevice)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              background: "#fff",
              color: "#667eea",
              fontWeight: "bold",
            }}
          >
            开始配对
          </button>
        )}
        {state === "pairing" && selectedDevice && (
          <button
            onClick={() => onConnect(selectedDevice)}
            disabled
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "not-allowed",
              background: "#fff",
              color: "#667eea",
              fontWeight: "bold",
              opacity: 0.5,
            }}
          >
            配对中...
          </button>
        )}
        {(state === "connecting" || state === "verifying") && (
          <button
            disabled
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "not-allowed",
              background: "#fff",
              color: "#667eea",
              fontWeight: "bold",
              opacity: 0.5,
            }}
          >
            连接中...
          </button>
        )}
        {state === "connected" && connectedDevice && (
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              background: "#fff",
              color: "#667eea",
              fontWeight: "bold",
            }}
          >
            完成
          </button>
        )}
        {(state === "not_configured" || state === "permission_needed") && permissions.bluetooth === "granted" && permissions.location === "granted" && (
          <button
            onClick={onScan}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              background: "#fff",
              color: "#667eea",
              fontWeight: "bold",
            }}
          >
            开始扫描
          </button>
        )}
        {(state === "permission_denied" || state === "connection_failed" || state === "pairing_failed" || state === "timeout") && (
          <button
            onClick={onScan}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              background: "#fff",
              color: "#667eea",
              fontWeight: "bold",
            }}
          >
            重试
          </button>
        )}
      </div>
    </div>
  );
}
