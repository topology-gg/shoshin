import React from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import testJsonStr0 from '../json/test_engine_demo0.json';
import testJsonStr1 from '../json/test_engine_demo1.json';
import testJsonStr2 from '../json/test_engine_demo2.json';
import testJsonStr3 from '../json/test_engine_demo3.json';
import testJsonStr4 from '../json/test_engine_demo4.json';
import testJsonStr5 from '../json/test_engine_demo5.json';
import testJsonStr6 from '../json/test_engine_demo6.json';
import testJsonStr7 from '../json/test_engine_demo7.json';
import testJsonStr8 from '../json/test_engine_demo8.json';
import testJsonStr9 from '../json/test_engine_demo9.json';
import testJsonStr10 from '../json/test_engine_demo10.json';
import testJsonStr11 from '../json/test_engine_demo11.json';
import testJsonStr12 from '../json/test_engine_demo12.json';
import testJsonStr13 from '../json/test_engine_demo13.json';

const LoadTestJson = ({
    handleLoadTestJson,
    handleClickPreloadedTestJson,
}) => {

    const preloadedTestJsons = [
        testJsonStr0,
        testJsonStr1,
        testJsonStr2,
        testJsonStr3,
        testJsonStr4,
        testJsonStr5,
        testJsonStr6,
        testJsonStr7,
        testJsonStr8,
        testJsonStr9,
        testJsonStr10,
        testJsonStr11,
        testJsonStr12,
        testJsonStr13,
    ]

    const BLANK_COLOR = '#EFEFEF'

    const onChangeInputTestJson = (event: any) => {
        if (/.json$/.exec(event.target.value)) {
            handleLoadTestJson (event);
        }
    }
    const onClickPreloadedTestJson = (i: number) => {
        handleClickPreloadedTestJson (preloadedTestJsons[i]);
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "27rem",
                backgroundColor: BLANK_COLOR,
                p: "1rem",
                mt: "1rem",
                border: 1,
                borderRadius: 4,
                boxShadow: 3,
            }}
        >
            <fieldset style={{fontSize:'12px', border:'1px groove #77777755'}}>
                <legend>Upload Json from testing</legend>
                <input
                    className='button' type="file"
                    style={{fontSize:'12px', border:'none', marginTop:'5px', backgroundColor:'#ffffff00'}}
                    onChange={(e) => onChangeInputTestJson(e)}
                />
            </fieldset>

            <p style={{margin:'0', fontSize:'12px', lineHeight: '25px', marginTop:'20px'}}>Preloaded: </p>
            <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap', marginTop:'0', height:'25px'}}>
                {
                    preloadedTestJsons.map( (testJson,i) => (
                        <button onClick={() => onClickPreloadedTestJson(i)}>{i}</button>
                    ))
                }
            </div>
        </Box>
    );
};

export default LoadTestJson;
