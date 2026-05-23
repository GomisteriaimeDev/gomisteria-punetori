import React, { useEffect, useState, useMemo } from "react";
import "./SalesDetails.scss";
import Dashboard from "../../../layouts/Dashboard";
import back from "../../../assets/svg/backArrow.svg";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../../services/api";
import BlueButton from "../../../components/BlueButton/BlueButton";
import Loader from "../../../components/Loader";

const SalesDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sale, setSale] = useState<any>({});
  const { id: orderId } = useParams();

  const statusOptions = [
    { value: "CREATED", label: "Krijuar" },
    { value: "PROCESSING", label: "Në Proces" },
    { value: "SHIPPED", label: "Transportuar" },
    { value: "DELIVERED", label: "Kompletuar" },
    { value: "CANCELLED", label: "Anuluar" },
    { value: "BORXH", label: "Borxh" },
  ];

  const [status, setStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const toNumber = (v: any, fallback = 0) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const fetchSale = async () => {
    const res = await getOrderById(orderId);
    setSale(res);
    setStatus(res?.status || "");
    setIsLoading(false);
  };

  const handleChangeStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    if (!newStatus) return;

    try {
      setIsUpdatingStatus(true);
      await updateOrderStatus(orderId, newStatus);
      alert("Status updated successfully");
      await fetchSale();
    } catch (err) {
      alert("Failed to update status");
      await fetchSale();
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadInvoicePDF = () => {
    const base64PDF = sale?.pdfBase64;
    if (!base64PDF) {
      alert("No PDF data available");
      return;
    }
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64PDF}`;
    link.download = `invoice-${sale?.orderNumber || "sale"}.pdf`;
    link.click();
  };

  const printPDF = () => {
    const base64PDF = sale?.pdfBase64;
    if (!base64PDF) {
      alert("No PDF data available");
      return;
    }

    const byteCharacters = atob(base64PDF);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    const newTab = window.open(blobUrl);
    if (newTab) {
      newTab.onload = () => newTab.print();
    }
  };

  const createdDate = useMemo(() => {
    const raw = sale?.createdAt;
    if (!raw) return "-";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
  }, [sale?.createdAt]);

  const customerName =
    sale?.fullName ||
    sale?.user?.specialFields?.companyName ||
    sale?.user?.specialFields?.fullName ||
    "-";

  const customerAddress =
    sale?.user?.role === "business"
      ? sale?.user?.address
      : sale?.user?.specialFields?.address;

  /**
   * ✅ SAME LOGIC AS FRONTEND (Checkout / Invoice):
   * - Base unit price uses productData.price
   * - If coupon exists => user discount is annulled
   * - Otherwise apply sale.discount (%) on each unit
   */
  const hasCoupon = useMemo(() => !!sale?.cupon, [sale?.cupon]);
  const userDiscountPct = useMemo(
    () => (hasCoupon ? 0 : toNumber(sale?.discount, 0)),
    [hasCoupon, sale?.discount]
  );

  const subtotal = useMemo(() => {
    const items = sale?.items || [];
    return items.reduce((sum: number, item: any) => {
      const baseUnit = toNumber(item?.productData?.price, 0);
      const qty = toNumber(item?.quantity, 0);

      const unitAfterDiscount =
        userDiscountPct > 0
          ? baseUnit - baseUnit * (userDiscountPct / 100)
          : baseUnit;

      return sum + unitAfterDiscount * qty;
    }, 0);
  }, [sale?.items, userDiscountPct]);

  const couponAmount = useMemo(() => {
    const c = sale?.cupon;
    if (!c) return 0;

    const couponType = c?.coupontype || c?.type; // handle both shapes
    const couponValue = toNumber(c?.value, 0);

    let amount = 0;
    if (couponType === "percentage") {
      amount = subtotal * (couponValue / 100);
    } else if (couponType === "fixed") {
      amount = couponValue;
    }

    amount = Math.max(0, Math.min(amount, subtotal));
    return amount;
  }, [sale?.cupon, subtotal]);

  const couponLabel = useMemo(() => {
    const c = sale?.cupon;
    if (!c) return "";

    const couponType = c?.coupontype || c?.type;
    const couponValue = toNumber(c?.value, 0);

    if (!couponType || !couponValue) return "";
    if (couponType === "percentage") return ` (${couponValue}%)`;
    if (couponType === "fixed") return ` (${couponValue.toFixed(2)}€)`;
    return "";
  }, [sale?.cupon]);

  const total = useMemo(() => {
    let t = subtotal - couponAmount;
    if (t < 0) t = 0;
    return t;
  }, [subtotal, couponAmount]);

  const mapsUrl = useMemo(() => {
    const lat = sale?.user?.specialFields?.latitude;
    const lon = sale?.user?.specialFields?.longitude;
    const address = customerAddress?.trim();

    if (typeof lat === "number" && typeof lon === "number") {
      return `https://www.google.com/maps?q=${lat},${lon}`;
    }

    if (address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
    }

    return "";
  }, [
    sale?.user?.specialFields?.latitude,
    sale?.user?.specialFields?.longitude,
    customerAddress,
  ]);

  return (
    <>
      <Dashboard pageTitle={"Shitjet"}>
        <div className="salesDetailsPage">
          <div className="invoice-wrapper">
            <div className="salesDetailsTopBar"></div>

            <div className="invoice">
              <a className="backLink" href="/sales" aria-label="Back to sales">
                <img src={back} alt="" />
              </a>

              <div className="invoice-top">
                <div className="invoice-logoPlaceholder">Gomisteriaime</div>

                <div className="invoice-main-information">
                  <div className="invoice-information">
                    Numri i porosisë: <span>#{sale?.orderNumber || "-"}</span>
                  </div>
                  <div className="invoice-information">
                    Data: <span>{createdDate}</span>
                  </div>
                </div>
              </div>

              <div className="invoice-data">
                <div className="invoice-data-section">
                  <label>Informacione të Gomisteriaime</label>
                  <div className="invoice-section-info">
                    <div className="invoice-information">
                      Kompania: <span>Gomisteriaime</span>
                    </div>
                    <div className="invoice-information">
                      Numri i Telefonit: <span>+383 46 666 333</span>
                    </div>
                    <div className="invoice-information">
                      Email Adresa: <span>gomisteriaime@hotmail.com</span>
                    </div>
                    <div className="invoice-information">
                      Adresa: <span>Ferizaj, Kosovo</span>
                    </div>
                  </div>
                </div>

                <div className="invoice-data-section">
                  <label>Informacione të klientit</label>
                  <div className="invoice-section-info">
                    <div className="invoice-information">
                      Emri: <span>{customerName}</span>
                    </div>

                    {sale?.user?.role === "business" &&
                      sale?.user?.specialFields?.nrARBK && (
                        <div className="invoice-information">
                          Numri ARBK:{" "}
                          <span>{sale?.user?.specialFields?.nrARBK}</span>
                        </div>
                      )}

                    <div className="invoice-information">
                      Email Adresa: <span>{sale?.user?.email || "-"}</span>
                    </div>

                    <div className="invoice-information">
                      Numri i Telefonit:{" "}
                      <span>{sale?.user?.specialFields?.phone || "-"}</span>
                    </div>

                    <div className="invoice-information">
                      Adresa:{" "}
                      {mapsUrl ? (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="addressLink"
                        >
                          <span>{customerAddress}</span>
                        </a>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                </div>

                {sale?.qrCode ? (
                  <img src={sale?.qrCode} alt="qr" className="qrCode" />
                ) : (
                  <div className="qrPlaceholder">QR</div>
                )}
              </div>

              <div className="invoice-products">
                {(sale?.items || []).map((item: any, idx: number) => {
                  const img = item?.productData?.images?.[0];
                  const title = item?.productData?.description || "-";
                  const brand = item?.productData?.brand || "-";
                  const category = item?.productData?.extra2 || "-";
                  const qty = toNumber(item?.quantity, 0);

                  // ✅ frontend uses productData.price
                  const baseUnit = toNumber(item?.productData?.price, 0);

                  // ✅ apply discount only when coupon not present
                  const unitAfterDiscount =
                    userDiscountPct > 0
                      ? baseUnit - baseUnit * (userDiscountPct / 100)
                      : baseUnit;

                  const code =
                    item?.productData?.code ||
                    item?.productData?.barcode ||
                    "-";

                  const lineTotal = unitAfterDiscount * qty;

                  return (
                    <div className="invoice-product" key={item?.id ?? idx}>
                      <div className="product-data">
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            className="product-data-image"
                          />
                        ) : (
                          <div className="product-data-image placeholder" />
                        )}

                        <div className="product-information">
                          <p>{title}</p>

                          <div className="invoice-product-description">
                            <div className="invoice-information">
                              Marka: <span>{brand}</span>
                            </div>
                            <div className="invoice-information">
                              Kategoria: <span>{category}</span>
                            </div>
                            <div className="invoice-information">
                              Sasia: <span>{qty}</span>
                            </div>

                            <div className="invoice-information">
                              Çmimi për njësi:{" "}
                              <span>{unitAfterDiscount.toFixed(2)}€</span>
                            </div>

                            {userDiscountPct > 0 && (
                              <div className="invoice-information">
                                Origjinali:{" "}
                                <span style={{ textDecoration: "line-through" }}>
                                  {baseUnit.toFixed(2)}€
                                </span>
                              </div>
                            )}

                            <div className="invoice-information">
                              Kodi: <span>{code}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="invoice-product-price">
                        {lineTotal.toFixed(2)}€
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="invoice-totals">
                <div className="invoice-right-middle">
                  <div className="invoice-price-details">
                    <div className="invoice-price-details-item">
                      <p>Subtotal</p>
                      <span>{subtotal.toFixed(2)}€</span>
                    </div>

                    <div className="invoice-price-details-item">
                      <p>Zbritje nga kuponi{couponLabel}:</p>
                      <span>-{couponAmount.toFixed(2)}€</span>
                    </div>

                    {!hasCoupon && userDiscountPct > 0 && (
                      <div className="invoice-price-details-item">
                        <p>Zbritje Klienti:</p>
                        <span>-{userDiscountPct.toFixed(2)}%</span>
                      </div>
                    )}
                  </div>

                  <div className="invoice-price-total">
                    <h6>Total</h6>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="topBarActions">
                <div className="selectionsSales">
                  <div className="assignEmployee">
                    <label>Statusi</label>
                    <select
                      value={status}
                      onChange={handleChangeStatus}
                      disabled={isUpdatingStatus}
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="invoice-buttons">
                  <BlueButton onClick={downloadInvoicePDF}>
                    Shkarko Faturën
                  </BlueButton>
                  <BlueButton onClick={printPDF}>Print Faturën</BlueButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dashboard>
    </>
  );
};

export default SalesDetails;
