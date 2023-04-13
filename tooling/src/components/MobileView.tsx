import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";

const MobileView = () => {
    return (
        <div>
            <Grid container spacing={0} marginTop={"200px"}>
                <Grid width item xs={4}></Grid>
                <Grid width item xs={4}>
                <img src ={"./images/jessica/dash_backward/right/frame_2.png"}/>
                </Grid>
                <Grid width item xs={4}></Grid>
                <Grid width item xs={2}></Grid>
                <Grid width item xs={8}>

                    
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                        This screen size is not supported yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        Please play on a larger display.
                        </Typography>
                    </CardContent>
                </Grid>
                <Grid width item xs={2}></Grid>
            </Grid>
        </div>
    );
};

export default MobileView;
