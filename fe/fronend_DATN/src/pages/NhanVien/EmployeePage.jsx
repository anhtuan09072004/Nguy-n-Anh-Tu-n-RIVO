import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Select } from "antd";
import employeeApi from "../../api/employeeApi";
import chucVuApi from "../../api/chucVuApi";

export default function EmployeePage() {
  const [data, setData] = useState([]);
  const [vaiTros, setVaiTros] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = async () => {
    try {
      const res = await employeeApi.getAll();
      setData(res.data);
    } catch (e) {
      message.error("Không tải được danh sách nhân viên");
    }
  };

  const loadVaiTro = async () => {
    try {
      const res = await chucVuApi.getAll();

      // chỉ lấy ADMIN + NHAN_VIEN
      const filtered = res.filter((item) => {
        const ten = item.ten?.toUpperCase();

        return (
          ten === "ADMIN" ||
        ten === "NHANVIEN" ||
        ten === "NHAN_VIEN" ||
        ten === "NHÂN VIÊN"
        );
      });

      setVaiTros(filtered);
    } catch (e) {
      message.error("Không tải được chức vụ");
    }
  };

  useEffect(() => {
    load();
    loadVaiTro();
  }, []);

  const handleOpen = (record = null) => {
    setEditing(record);
    setOpen(true);

    if (record) {
      const selectedRole = vaiTros.find(
        (v) => v.ten === record.vaiTro
      );

      form.setFieldsValue({
        ...record,
        password: "",
        vaiTroId: selectedRole?.id,
      });
    } else {
      form.resetFields();
    }
  };

 const submit = async () => {
  try {
    const values = await form.validateFields();

    const payload = {
      ten: values.ten,
      username: values.username,
      password: values.password,
      email: values.email,
      soDienThoai: values.soDienThoai,
      gioiTinh: values.gioiTinh,
       vaiTroId: values.vaiTroId,
    };

   console.log("payload gửi lên =", JSON.stringify(payload, null, 2));

    if (editing) {
      await employeeApi.update(editing.id, payload);
      message.success("Cập nhật thành công");
    } else {
      await employeeApi.create(payload);
      message.success("Thêm thành công");
    }

    setOpen(false);
    setEditing(null);
    form.resetFields();
    load();
  } catch (err) {
    console.error(err);
    message.error("Lỗi!");
  }
};

  const columns = [
    {
      title: "Tên",
      dataIndex: "ten",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "SĐT",
      dataIndex: "soDienThoai",
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
    },
    {
      title: "Chức vụ",
      dataIndex: "vaiTro",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button onClick={() => handleOpen(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>👨‍💼 Quản lý nhân viên</h2>

      <Button type="primary" onClick={() => handleOpen()}>
        + Thêm nhân viên
      </Button>

      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editing ? "Cập nhật nhân viên" : "Thêm nhân viên"}
        open={open}
        onOk={submit}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="ten"
            label="Tên"
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
            ]}
          >
            <Input disabled={!!editing} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: !editing,
                message: "Không được để trống",
              },
              {
                min: 6,
                message: "Ít nhất 6 ký tự",
              },
            ]}
          >
            <Input.Password placeholder="Để trống nếu không đổi" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
              {
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="soDienThoai" label="SĐT">
            <Input />
          </Form.Item>

          <Form.Item name="gioiTinh" label="Giới tính">
            <Input />
          </Form.Item>

          <Form.Item
            name="vaiTroId"
            label="Chức vụ"
            rules={[
              {
                required: true,
                message: "Chọn chức vụ",
              },
            ]}
          >
            <Select placeholder="Chọn chức vụ">
              {vaiTros.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}