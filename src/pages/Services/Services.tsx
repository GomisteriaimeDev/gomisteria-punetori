import React, { useState } from "react";
import Dashboard from "../../layouts/Dashboard";
import "./Services.scss";
import Table from "../../components/Table/Table";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import BlueButton from "../../components/BlueButton/BlueButton";
import useFetchData, {
  approveService,
  getServiceOrders,
} from "../../services/api";
import capitalize from "../../utils/Capitalize";
import Pagination from "../../components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import formatDate from "../../utils/FormatDate";
import ApprovalModal from "./ApprovalModal";

const Services = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useFetchData(getServiceOrders);
  const totalItems = data ? data.total : 0;
  const totalPages = Math.ceil(totalItems / 10);
  const [selectedOption, setSelectedOption] = useState("Të gjitha");
  const [showModal, setShowModal] = useState(false);
  const [selectedServiceOrder, setSelectedServiceOrder] = useState(null);
  const navigate = useNavigate();

  const options = ["Të gjitha", "Aktive", "Jo Aktive", "E Paguar","Perfunduar"];

  const handleDropdownChange = (value: any) => {
    setSelectedOption(value);
  };

  const filterServiceOrders = (services: any, filter: any) => {
    switch (filter) {
      case "E Paguar":
        return services.filter((service: any) => service.status === "paid");
      case "Aktive":
        return services.filter((service: any) => service.status === "active");
      case "Jo Aktive":
        return services.filter((service: any) => service.status === "inactive");
      case "Perfunduar":
        return services.filter(
          (service: any) => service.status === "completed"
        );

      default:
        return services;
    }
  };

  const filteredData = data ? filterServiceOrders(data, selectedOption) : [];

  const handleRowClick = (id: any) => {
    navigate(`/services/${id}`);
  };

  const getStatusDot = (status: any) => {
    switch (status) {
      case "completed":
        return <span className="status-dot lightBlue"></span>;
      case "paid":
        return <span className="status-dot green"></span>;
      case "active":
        return <span className="status-dot yellow"></span>;
      case "inactive":
        return <span className="status-dot red"></span>;
      default:
        return <span className="status-dot unknown"></span>;
    }
  };

  const columns = [
    { title: "Numri i porosisë" },
    { title: "Service Type" },
    { title: "Emri i plotë" },
    { title: "Industria" },
    { title: "Deadline" },
    { title: "Statusi" },
  ];

  const rows =
    filteredData?.map((service: any) => ({
      cells: [
        { content: `#${service.serviceOrderNumber}` },
        { content: service.Service.name },
        { content: service?.User?.specialFields?.fullName },
        { content: service.Business.specialFields.businessType },
        { content: `${service.ora} ${formatDate(service.data)}` },
        {
          content: (
            <div className="status-cell">
              {getStatusDot(service.status)}
              {capitalize(service.status)}
            </div>
          ),
        },
      ],
      onClick: () => openModal(service),
      onApprove: () => openModal(service),
    })) || [];

  const openModal = (serviceOrder: any) => {
    setSelectedServiceOrder(serviceOrder);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedServiceOrder(null);
  };

  const handleApprove = async (id: any, status: any) => {
    try {
      await approveService(id, status); // Call the API to update the status
      console.log(`Service order ${id} status updated to: ${status}`);
      window.location.reload();
      closeModal();
    } catch (error) {
      console.error(`Failed to update service order status: ${id}`, error);
    }
  };

  return (
    <Dashboard pageTitle={"Shërbimet"}>
      <div className="salesWrapper">
        <div className="dashboardHeader">
          <h2>Shërbimet</h2>
          <div className="actionsHeader">
            <FilterDropdown
              label="Shfaq:"
              options={options}
              selectedValue={selectedOption}
              onChange={handleDropdownChange}
            />
          </div>
        </div>
        <Table columns={columns} rows={rows} />
        <ApprovalModal
          show={showModal}
          onClose={closeModal}
          serviceOrder={selectedServiceOrder}
          onApprove={handleApprove}
        />
        {/* <div className="paginationSection">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </div> */}
      </div>
    </Dashboard>
  );
};

export default Services;
