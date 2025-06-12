import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" display="flex"  justifyContent="space-between" padding="5px">
      <Box display="flex" flexDirection="column" justifyContent="space-around">
        <Box>
          {/* {icon} */}
          <Typography
            // variant="h4"
            fontSize={15}
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {subtitle}

          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: colors.blueAccent[500], fontWeight: "bold", fontSize: 28 }}>
            {title}
          </Typography>
          <Typography
            variant="h5"
            fontStyle="italic"
            sx={{ color: colors.greenAccent[600] }}
          >
            {increase}
          </Typography>

        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" >
        <ProgressCircle progress={progress} />
      </Box>
    </Box>
  );
};

export default StatBox;