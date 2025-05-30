import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import  "../styles/Contact.css"

function Contact() {
  return (
    <div style={{ padding: "2rem", maxWidth: "100%", margin: "auto",  }}>
      <Card
        title="Contact Us"
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 12 }}
      >
        <p>
          <MailOutlined style={{ marginRight: 8 }} />
          <strong>Email:</strong>{" "}
          <a href="mailto:mohamedtameen7@gmail.com">mohamedtameen7@gmail.com</a>
        </p>
        <p>
          <PhoneOutlined style={{ marginRight: 8 }} />
          <strong>Phone:</strong> <a href="tel:8553545732">+91 8553545732</a>
        </p>
        <p>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          <strong>Address:</strong> Bapuji MBA College Davngere, Karnataka
        </p>
        <p>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          <strong>Working Hours:</strong> Mon - Fri: 9:00 AM - 6:00 PM (PST)
        </p>
      </Card>
    </div>
  );
}

export default Contact;
