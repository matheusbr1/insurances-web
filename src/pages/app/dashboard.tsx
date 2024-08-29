import React from "react";
import { Helmet } from "react-helmet-async";
import { Charts } from "../../components/producaoPorSeguradora";


export const Dashboard: React.FC = () => {
  return (
    <>
      <Helmet title="Dashboard" />
      <Charts />
    </>
  );
}
