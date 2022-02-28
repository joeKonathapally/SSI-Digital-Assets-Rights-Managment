import { useState, useEffect } from "react";
import {endorseTransactions} from "../../helper/endorser/endorseTransactions";
import {refuseTransactions} from "../../helper/endorser/refuseTransactions";

function EndorseTransaction(props){

  function getAttributes(){
    let content=[];
    for (var val in props.tran){
      let temp = <>{val}: {JSON.stringify(props.tran[val])}<br/></>;
      content.push(temp)
    }
    return content;
  }

  async function endorseTransaction() {
    await endorseTransactions(props.api_url, props.tran.transaction_id);
  }

  async function refuseTransaction() {
    await refuseTransactions(props.api_url, props.tran.transaction_id);
  }

  function actionControl(){
    if(props.tran.state === undefined){
      return <></>;
    }else{
      if(props.tran.state === "request_received"){
        return(
          <>
            <button onClick={endorseTransaction}>Endorse Transaction</button>
            <button onClick={refuseTransaction}>Refuse Transaction</button>
          </>
        );
      }
    }
  }

  return(
    <>
      {/* {props.conn.map((element) => {
        return <p>element</p>;
      })} */}
      {getAttributes()}
      <br/>
      {actionControl()}
      <br/>
    </>
  );

};

export default EndorseTransaction;