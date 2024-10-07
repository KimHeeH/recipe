import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AWS from "aws-sdk";
import axios from "axios";
import YouTube from "react-youtube";
import "./MyRecipe.style.css";
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const MyRecipe = () => {
  const [myRecipe, setMyRecipe] = useState([]);
  const [videoID, setVideoID] = useState([]);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      // DynamoDB에서 사용자가 좋아요한 비디오 데이터를 가져옵니다.
      const params = {
        TableName: "HeartTable",
      };

      try {
        const data = await dynamodb.scan(params).promise();
        setMyRecipe(data.Items);

        // 비디오 ID 배열을 생성합니다.
        const videoIds = data.Items.map((recipe) => recipe.videoID);
        if (videoIds.length > 0) {
          // YouTube API에서 비디오 정보를 가져옵니다.
          const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
          const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
              params: {
                part: "snippet", // 필요한 비디오 정보
                id: videoIds.join(","), // 여러 videoId를 콤마로 구분하여 요청
                maxResults: 50,
                key: apiKey,
              },
            }
          );

          // 비디오 ID 배열을 상태로 저장합니다.
          const ids = response.data.items.map((item) => item.id);
          setVideoID(ids);
        }
      } catch (error) {
        console.error("Error fetching recipes or YouTube data:", error);
      }
    };

    fetchMyRecipes();
  }, []); // 의존성 배열을 빈 배열로 설정하여 첫 로드 시 한 번만 실행

  return (
    <div>
      <Container
        fluid
        style={{
          marginTop: "30px",
          borderTop: "1px solid #D9D9D9",
        }}
      >
        <div style={{ marginTop: "30px", marginBottom: "30px" }}>
          <h2>나의 레시피 ({myRecipe.length})</h2>
          <p style={{ color: "#555", fontSize: "16px" }}>
            내가 좋아요한 요리 영상들입니다. 마음에 드는 레시피를 저장하고,
            언제든지 다시 확인해보세요!
          </p>
        </div>
        <Row className="justify-content-start no-gutters">
          {videoID.map((video, index) => (
            <Col lg={4} md={4} sm={6} xs={12} key={index} className="mb-4">
              <YouTube
                videoId={video}
                opts={{ width: "100%", height: "210px" }}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default MyRecipe;
