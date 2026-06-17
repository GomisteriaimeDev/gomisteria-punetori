import React, { useMemo, useState, useEffect } from "react";
import Dashboard from "../../layouts/Dashboard";
import "./Sales.scss";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import { getOrdersAssignedToEmployee } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import formatDate from "../../utils/FormatDate";

const ORDER_STATUSES = [
  { value: "ALL", label: "Të gjitha" },
  { value: "CREATED", label: "Krijuar" },
  { value: "PROCESSING", label: "Në Proces" },
  { value: "SHIPPED", label: "Transportuar" },
  { value: "DELIVERED", label: "Kompletuar" },
  { value: "CANCELLED", label: "Anuluar" },
  { value: "BORXH", label: "Borxh" },
] as const;

type OrderStatusValue = (typeof ORDER_STATUSES)[number]["value"];

const getStatusLabel = (status?: string) =>
  ORDER_STATUSES.find((s) => s.value === status)?.label ?? status ?? "-";

const Sales = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Orders assigned to this employee are fetched directly (the auth/profile
  // payload no longer carries the full order graph).
  const [assignedOrders, setAssignedOrders] = useState<any[]>([]);

  useEffect(() => {
    const employeeId = currentUser?.id;
    if (!employeeId) return;

    let cancelled = false;
    getOrdersAssignedToEmployee(employeeId)
      .then((orders) => {
        if (!cancelled) setAssignedOrders(Array.isArray(orders) ? orders : []);
      })
      .catch((err) => {
        console.error("Failed to load assigned orders:", err);
        if (!cancelled) setAssignedOrders([]);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id]);

  // Dropdown stores selected status VALUE (ALL/CREATED/...)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusValue>("ALL");

  // FilterDropdown expects array of strings -> give it labels
  const options = ORDER_STATUSES.map((s) => s.label);

  const handleDropdownChange = (label: string) => {
    const found = ORDER_STATUSES.find((s) => s.label === label);
    setSelectedStatus(found?.value ?? "ALL");
  };

  const handleRowClick = (id: any) => {
    navigate(`/sales/${id}`);
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "CREATED":
        return <span className="status-dot lightBlue"></span>;
      case "PROCESSING":
      case "SHIPPED":
        return <span className="status-dot yellow"></span>;
      case "DELIVERED":
        return <span className="status-dot green"></span>;
      case "CANCELLED":
        return <span className="status-dot red"></span>;
      case "BORXH":
        return <span className="status-dot orange"></span>;
      default:
        return <span className="status-dot unknown"></span>;
    }
  };

  // ALWAYS sort by newest createdAt, THEN filter by selected status
  const sortedAndFilteredOrders = useMemo(() => {
    return [...assignedOrders]
      .sort((a: any, b: any) => {
        const aTime = new Date(a?.createdAt ?? 0).getTime();
        const bTime = new Date(b?.createdAt ?? 0).getTime();
        return bTime - aTime; // newest first
      })
      .filter((order: any) =>
        selectedStatus === "ALL" ? true : order?.status === selectedStatus
      );
  }, [assignedOrders, selectedStatus]);

  // Optional: if your API/user data can change and you want to ensure
  // UI stays stable when switching filters, keep this (no-op but safe).
  useEffect(() => {}, [selectedStatus]);

  return (
    <Dashboard pageTitle={"Shitjet"}>
      <div className="salesWrapper">
        <div className="dashboardHeader">
          <h2>Shitjet</h2>
          <FilterDropdown
            label="Shfaq:"
            options={options}
            selectedValue={
              ORDER_STATUSES.find((s) => s.value === selectedStatus)?.label ??
              "Të gjitha"
            }
            onChange={handleDropdownChange}
          />
        </div>

        <div className="ordersList">
          {sortedAndFilteredOrders.map((data: any) => (
            <div
              className="orderItem"
              key={data.id}
              onClick={() => handleRowClick(data.id)}
              role="button"
              tabIndex={0}
            >
              <div className="top">
                <div className="topDetails">
                  <ul>
                    <li>
                      Porosia: <strong>#{data.orderNumber}</strong>
                    </li>
                    <li>
                      Shteti: <strong>{data.country}</strong>
                    </li>
                    <li>
                      Data: <strong>{formatDate(data.createdAt)}</strong>
                    </li>
                    <li>
                      Emri:{" "}
                      <strong>
                        {data?.user?.specialFields?.companyName ||
                          data?.user?.specialFields?.fullName}
                      </strong>
                    </li>
                  </ul>
                </div>

                <div className="topStatus">
                  <div className="statusi">
                    <div className="status-cell">
                      {getStatusDot(data.status)} {getStatusLabel(data.status)}
                    </div>
                  </div>
                  <img src={data.qrCode} alt="" className="qr" />
                </div>
              </div>

              <div className="bottom">
                <div className="totali">
                  Totali: <span>{Number(data.total).toFixed(2)}€</span>
                </div>

                <a
                  href={`/sales/${data.id}`}
                  className="fatura"
                  onClick={(e) => e.stopPropagation()}
                >
                  Shiko detajet
                </a>
              </div>
            </div>
          ))}

          {sortedAndFilteredOrders.length === 0 && (
            <div className="emptyState">Nuk ka porosi për këtë filtër.</div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default Sales;
