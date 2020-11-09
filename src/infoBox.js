import React from "react";
import "./infoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, time, casesType, active, handleCase, cases, total }) {
  time = time ? time.updated : null;
  return (
    <Card
      className={`infoBox ${active && casesType}`}
      onClick={() => handleCase(casesType)}
    >
      <CardContent>
        {/* <Typography color="textPrimary">
          Last updated {new Date(time).toDateString()}
        </Typography> */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2
          className={`infoBox__cases ${casesType}Color ${
            active && casesType
          }Color`}
        >
          {" "}
          {cases}
        </h2>
        <Typography className="infoBox__total" color="textSecondary">
          {`${total}`} Total
        </Typography>
        <Typography color="textPrimary">
          Last updated {new Date(time).toDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
