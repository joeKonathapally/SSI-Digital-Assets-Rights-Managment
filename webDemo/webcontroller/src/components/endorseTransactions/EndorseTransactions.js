import { useEffect } from "react";
import { useState } from "react";
import {getEndorserTransactions} from "../../helper/endorser/getEndorserTransactions";
import EndorseTransaction from "./EndorseTransaction";

function EndorseTransactions(props){

  const [results, setresults] = useState([]);


  useEffect(() => {
    async function fetchData(){
      let data = await getEndorserTransactions(props.api_url);
      setresults(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    
    const ws = new WebSocket(props.hook_url+'topic/endorse_transaction');

    ws.onopen = function open() {
      ws.send('web controller connected');
    };

    ws.onmessage = (e) => {
      console.log(JSON.parse(e.data));
      console.log(Date.parse(JSON.parse(e.data).updated_at));
      setresults((results) => {
        let temp = []
        results.map((element) => {
          if(!(JSON.parse(e.data).transaction_id === element.transaction_id)){
            temp.push(element);
          }
        })
        temp.push(JSON.parse(e.data));
        temp.sort(function(a,b){
          return Date.parse(b.updated_at) - Date.parse(a.updated_at);
        })
        return temp;
      })
    }

    return() => {
      ws.close();
    };
  }, [])

  return(
    <>
      {results.map((conn) => {
        return(<EndorseTransaction tran={conn} key={conn.transaction_id} api_url={props.api_url}/>);
      })}
    </>
  );

};

export default EndorseTransactions;