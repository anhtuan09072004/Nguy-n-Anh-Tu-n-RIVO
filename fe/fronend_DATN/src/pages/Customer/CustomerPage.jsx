import { useEffect, useState } from "react";
import "./CustomerPage.css";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import customerApi from "../../api/customerApi";
import diaChiApi from "../../api/diaChiApi";
import addressDataJson from "../../data/address.json";
import dayjs from "dayjs";

export default function CustomerPage() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // 👉 Address state
  const [openAddress, setOpenAddress] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [addressData, setAddressData] = useState([]);
  const [formAddress] = Form.useForm();
  const [editingAddress, setEditingAddress] = useState(null);

  // 👉 Address JSON state
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // ======================
  // LOAD DATA
  // ======================
  const loadData = async () => {
    const res = await customerApi.getAll();
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ======================
  // LOAD ADDRESS JSON
  // ======================
  useEffect(() => {
    if (openAddress) {
      setProvinces(addressDataJson);
    }
  }, [openAddress]);

  const handleProvinceChange = (value) => {
    const province = provinces.find((p) => p.name === value);

    setDistricts(province?.districts || []);
    setWards([]);

    formAddress.setFieldsValue({
      quanHuyen: null,
      phuongXa: null,
    });
  };

  const handleDistrictChange = (value) => {
    const district = districts.find((d) => d.name === value);

    setWards(district?.wards || []);

    formAddress.setFieldsValue({
      phuongXa: null,
    });
  };

  // ======================
  // CUSTOMER
  // ======================
  const handleOpen = (record = null) => {
    setEditing(record);
    setOpen(true);

    if (record) {
      form.setFieldsValue({
        ...record,
        ngaySinh: record.ngaySinh ? dayjs(record.ngaySinh) : null,
      });
    } else {
      form.resetFields();
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        ngaySinh: values.ngaySinh?.format("YYYY-MM-DD"),
      };

      if (editing) {
        await customerApi.update(editing.id, payload);
        message.success("Cập nhật thành công");
      } else {
        await customerApi.create(payload);
        message.success("Thêm thành công");
      }

      setOpen(false);
      loadData();
    } catch (err) {
      message.error(err.response?.data || "Lỗi!");
    }
  };

  // ======================
  // ADDRESS
  // ======================
  const handleAddress = async (record) => {
    setCustomerId(record.id);
    setOpenAddress(true);

    const res = await diaChiApi.getByCustomer(record.id);
    setAddressData(res.data);
  };

  const handleSubmitAddress = async () => {
    try {
      const values = await formAddress.validateFields();

      const payload = {
        ...values, // 👉 đã là string sẵn rồi
        taiKhoanId: customerId,
      };

      if (editingAddress) {
        await diaChiApi.update(editingAddress.id, payload);
        message.success("Cập nhật địa chỉ thành công");
      } else {
        await diaChiApi.create(payload);
        message.success("Thêm địa chỉ thành công");
      }

      const res = await diaChiApi.getByCustomer(customerId);
      setAddressData(res.data);

      formAddress.resetFields();
      setEditingAddress(null);
    } catch (err) {
      message.error("Lỗi!");
    }
  };

  const handleDeleteAddress = async (id) => {
    await diaChiApi.delete(id);
    message.success("Xóa thành công");

    const res = await diaChiApi.getByCustomer(customerId);
    setAddressData(res.data);
  };

  // 👉 EDIT ADDRESS (fill lại select)
  const handleEditAddress = (record) => {
    setEditingAddress(record);

    const province = addressDataJson.find(
      (p) => p.name === record.tinhThanh
    );

    const district = province?.districts.find(
      (d) => d.name === record.quanHuyen
    );

    const ward = district?.wards.find(
      (w) => w.name === record.phuongXa
    );

    setProvinces(addressDataJson);
    setDistricts(province?.districts || []);
    setWards(district?.wards || []);

    formAddress.setFieldsValue({
      ...record,
      tinhThanh: province?.name,
      quanHuyen: district?.name,
      phuongXa: ward?.name,
    });
  };

  // ======================
  // TABLE CUSTOMER
  // ======================
  const columns = [
    { title: "STT", dataIndex: "id" },
    { title: "Tên", dataIndex: "ten" },
    { title: "Username", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "SĐT", dataIndex: "soDienThoai" },
    { title: "Giới tính", dataIndex: "gioiTinh" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleOpen(record)}>Sửa</Button>
          <Button
            onClick={() => handleAddress(record)}
            style={{ marginLeft: 8 }}
          >
            Địa chỉ
          </Button>
        </>
      ),
    },
  ];

  // ======================
  // RENDER
  // ======================
  return (
   <div className="customer-page">
     <div className="customer-page-header">
        <h2>👤 Quản lý khách hàng</h2>
      </div>

      <div className="customer-page-toolbar">
        <Button type="primary" onClick={() => handleOpen()}>
          + Thêm khách hàng
        </Button>
      </div>

      <div className="customer-table-wrap">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* ================= CUSTOMER MODAL ================= */}
      <Modal
        title={editing ? "Cập nhật khách hàng" : "Thêm khách hàng"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {!editing && (
            <>
              <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="soDienThoai" label="SĐT" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="gioiTinh" label="Giới tính">
            <Select
              options={[
                { value: "Nam", label: "Nam" },
                { value: "Nữ", label: "Nữ" },
              ]}
            />
          </Form.Item>

          <Form.Item name="ngaySinh" label="Ngày sinh">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= ADDRESS MODAL ================= */}
      <Modal
        title="Quản lý địa chỉ"
        open={openAddress}
        onCancel={() => setOpenAddress(false)}
        onOk={handleSubmitAddress}
        width={800}
      >
        <Button
          type="primary"
          onClick={() => {
            formAddress.resetFields();
            setEditingAddress(null);
          }}
        >
          + Thêm địa chỉ
        </Button>

        <Table
          rowKey="id"
          dataSource={addressData}
          style={{ marginTop: 10 }}
          columns={[
            { title: "Tên", dataIndex: "ten" },
            { title: "SĐT", dataIndex: "soDienThoai" },
            { title: "Địa chỉ", dataIndex: "diaChiCuThe" },
            {
              title: "Action",
              render: (_, record) => (
                <>
                  <Button onClick={() => handleEditAddress(record)}>
                    Sửa
                  </Button>
                  <Button danger onClick={() => handleDeleteAddress(record.id)}>
                    Xóa
                  </Button>
                </>
              ),
            },
          ]}
        />

        <Form form={formAddress} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="ten" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="soDienThoai" label="SĐT">
            <Input />
          </Form.Item>

          <Form.Item name="diaChiCuThe" label="Địa chỉ cụ thể">
            <Input />
          </Form.Item>

          <Form.Item name="tinhThanh" label="Tỉnh/Thành">
            <Select
              showSearch
              placeholder="Chọn tỉnh"
              options={provinces.map((p) => ({
                value: p.name,
                label: p.name,
              }))}
              onChange={handleProvinceChange}
            />
          </Form.Item>

          <Form.Item name="quanHuyen" label="Quận/Huyện">
            <Select
              showSearch
              placeholder="Chọn quận"
              options={districts.map((d) => ({
                value: d.name,
                label: d.name,
              }))}
              onChange={handleDistrictChange}
            />
          </Form.Item>

          <Form.Item name="phuongXa" label="Phường/Xã">
            <Select
              showSearch
              placeholder="Chọn phường"
              options={wards.map((w) => ({
                value: w.name,
                label: w.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}