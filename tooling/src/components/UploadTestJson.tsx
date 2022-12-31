import React from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

const UploadTestJson = ({ handleChangeTestJson }) => {

    const BLANK_COLOR = '#EFEFEF'

    const onChangeTestJson = (event: any) => {
        if (/.json$/.exec(event.target.value)) {
            handleChangeTestJson (event);
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
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
                    onChange={(e) => onChangeTestJson(e)}
                />
            </fieldset>
        </Box>
    );
};

export default UploadTestJson;
