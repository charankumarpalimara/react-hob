import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = 0.75, size = 90, borderWidth = 14 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  // Inner circle size calculation
  const innerCircleSize = size - borderWidth * 2; // Ensures space for text

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        background: `conic-gradient(${colors.blueAccent[500]} 0deg ${angle}deg, ${colors.blueAccent[200]} ${angle}deg 360deg)`,
      }}
    >
      {/* Inner Circle */}
      <Box
        sx={{
          position: "absolute",
          width: `${innerCircleSize}px`,
          height: `${innerCircleSize}px`,
          borderRadius: "50%",
          backgroundColor: colors.primary[400],
        }}
      />
      
      {/* Centered Percentage Text */}
      <Typography
        sx={{
          position: "absolute",
          color: "#000",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {Math.round(progress * 100)}%
      </Typography>
    </Box>
  );
};

export default ProgressCircle;
