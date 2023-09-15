/* eslint-disable react/jsx-key */
import { useState } from "react";
import { Card, Menu, Steps } from "antd";
import { useFormik } from "formik";
import "./MultiStepRegist.css";
import {
  AccountInfoStep,
  AddressInfoStep,
  PersonalInfoStep,
} from "../../components";
import {
  addressInfoValidationSchema,
  personalInfoValidationSchema,
  accountInfoValidationSchema,
} from "../../assets/validations";

const { Step } = Steps;

const validationSchemas = [
  personalInfoValidationSchema,
  addressInfoValidationSchema,
  accountInfoValidationSchema,
];

const MultiStepRegist = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validSteps, setValidSteps] = useState([true, false, false]);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      dateOfBirth: null,
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      username: "",
      password: "",
    },
    validationSchema: validationSchemas[currentStep],
    onSubmit: async (values) => {
      // Validate the form for the current step
      const errors = await formik.validateForm();

      // Check if there are no errors before proceeding
      if (Object.keys(errors).length === 0) {
        // If we're on the last step, handle form submission
        if (currentStep >= 2) {
          console.log("Registration data:", values);
          // Handle registration submission here, e.g., sending data to the server
          return;
        }

        // If we're not on the last step, go to the next step
        setCurrentStep((prevStep) => prevStep + 1);
        setValidSteps((prevValidSteps) => {
          const newValidSteps = [...prevValidSteps];
          newValidSteps[currentStep + 1] = true;
          return newValidSteps;
        });
      }
    },
  });

  const handleBackClick = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMenuClick = (step) => {
    if (validSteps[step]) {
      setCurrentStep(step);
    }
  };

  const stepComponents = [
    <PersonalInfoStep formik={formik} />,
    <AddressInfoStep formik={formik} handleBackClick={handleBackClick} />,
    <AccountInfoStep formik={formik} handleBackClick={handleBackClick} />,
  ];

  return (
    <div className="form-container">
      <Card
        title={
          currentStep === 0
            ? "Personal Information"
            : currentStep === 1
            ? "Address Information"
            : "Account Information"
        }
        className="card-with-sider"
      >
        <div className="form-content">
          <div className="sider">
            <Menu
              mode="vertical"
              selectedKeys={[`${currentStep}`]}
              className="menu"
            >
              <Menu.Item
                key="0"
                onClick={() => handleMenuClick(0)}
                disabled={!validSteps[0]}
                className="menu-item"
              >
                Personal Information
              </Menu.Item>
              <Menu.Item
                key="1"
                onClick={() => handleMenuClick(1)}
                disabled={!validSteps[1]}
                className="menu-item"
              >
                Address Information
              </Menu.Item>
              <Menu.Item
                key="2"
                onClick={() => handleMenuClick(2)}
                disabled={!validSteps[2]}
                className="menu-item"
              >
                Account Information
              </Menu.Item>
            </Menu>
          </div>
          <div className="content">
            <Steps
              current={currentStep}
              className="steps"
              direction="horizontal"
            >
              <Step title="Personal Information" />
              <Step title="Address Information" />
              <Step title="Account Information" />
            </Steps>
            <form onSubmit={formik.handleSubmit}>
              {stepComponents[currentStep]}
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MultiStepRegist;
