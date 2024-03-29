import React, { useState, useEffect } from 'react';
import { Image, Box, SimpleGrid } from '@chakra-ui/react';
import ScoreDisplay from './ScoreDisplay';

const Popup = () => {
  const [locationSrc, setLocationSrc] = useState(null);
  const [portraitsSrcs, setPortraitsSrcs] = useState([]);
  const [receivedScores, setReceivedScores] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
        if (event.data.type === "DATA_UPDATE") {
            setReceivedScores(event.data.data.scores);
            setLocationSrc(event.data.data.locationSrc);
            setPortraitsSrcs(event.data.data.portraitsSrcs);
        }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
}, []);

const renderPortraits = () => {
  const numPortraits = portraitsSrcs.length;

  // If 4 or more images, just render them in a grid
  if (numPortraits >= 4) {
      return (
          <Box display="flex" flexWrap="wrap" justifyContent="center">
              {portraitsSrcs.map((src, index) => (
                  <Box key={index} flexBasis={{ base: "50%", md: "25%" }} p={2}>
                      <img src={src} alt={`Portrait ${index}`} style={{ width: '100%', height: 'auto' }} />
                  </Box>
              ))}
          </Box>
      );
  }

  // For 1-3 images, render them as larger images centered on the screen
  return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80%">
          {portraitsSrcs.map((src, index) => (
              <Box key={index} flexBasis="100%" p={2}>
                  <img src={src} alt={`Portrait ${index}`} style={{ maxWidth: '100%', maxHeight: '80vh' }} />
              </Box>
          ))}
      </Box>
  );
};

  return (
    <Box 
    w="100vw" 
    h="100vh" 
    bg={locationSrc ? `url(${locationSrc}) center/cover no-repeat` : 'black'}
    position="relative" 
    display="flex"
    alignItems="center"
    justifyContent="center"
>
{renderPortraits()}
      <Box 
    position={'absolute'} 
    display="flex"
    flexWrap="wrap"
    justifyContent={receivedScores.length === 1 ? "center" : "flex-start"}
    width="100%"
>
  {
    receivedScores.map(score => (
      <Box 
          key={score.name}
          width={receivedScores.length === 1 ? "auto" : "50%"}
          p={2} // this acts as spacing between the items
      >
        <ScoreDisplay 
          name={score.name} 
          successes={score.successes} 
          failures={score.failures} 
        />
      </Box>
    ))
  }
</Box>

    </Box>
  );
};

export default Popup;
