import React from 'react'
import Layout from '../components/Layout';
import NewFee from '../components/fee/NewFee';

function Fees() {
  return (
    <Layout>
      <NewFee title="Fee"  mode="New Entry"/>
    </Layout>
  )
}

export default Fees