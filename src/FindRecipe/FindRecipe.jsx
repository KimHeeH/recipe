import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { Button, Container, Row, Col } from "react-bootstrap";
import YouTube from "react-youtube";
import axios from "axios";
import "./FindRecipe.style.css";
import TrueHeart from "./img/TrueHeart.png";
import FalseHeart from "./img/FalseHeart.png";

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const FindRecipe = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSearchVideo, setShowSearchVideo] = useState(false);
  const [videoIds, setVideoIds] = useState([]); // 여러 비디오의 ID를 저장하는 배열
  const [heartStates, setHeartStates] = useState({}); // 각 비디오의 하트 상태를 객체로 관리
  const [heartRecipe, setHeartRecipe] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const params = {
        TableName: "IngredientsTable",
      };

      try {
        const data = await dynamodb.scan(params).promise();
        setIngredients(data.Items);
      } catch (error) {
        console.error("Error fetching ingredients: ", error);
      }
    };

    fetchIngredients();
  }, []);

  const toggleLike = async (id) => {
    // 현재 비디오의 하트 상태를 토글
    setHeartStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id], // 현재 비디오 ID에 대한 하트 상태를 토글
    }));

    const params = {
      TableName: "HeartTable",
      Item: {
        id: new Date().getTime().toString(),
        videoID: id,
      },
    };
    console.log("Params being sent to DynamoDB:", params);
    try {
      await dynamodb.put(params).promise();
      console.log("Data successfully added to DynamoDB");
      setHeartRecipe([...heartRecipe, params.Item]);
    } catch (error) {
      console.error("Error adding Like Video: ", error);
    }
  };

  const searchRecipe = async () => {
    if (inputValue.trim()) {
      try {
        const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: "snippet",
              q: inputValue,
              type: "video",
              maxResults: 12, // 최대 12개 결과 요청
              key: apiKey,
            },
          }
        );
        console.log(response.data);
        const videoIds = response.data.items.map((item) => item.id.videoId);
        setVideoIds(videoIds); // 상태 업데이트
        setShowSearchVideo(true);
      } catch (error) {
        console.error("YouTube API 요청 중 오류 발생: ", error);
      }
    }
  };

  return (
    <div>
      <Container style={{ borderTop: "1px solid #D9D9D9", marginTop: "30px" }}>
        {/* 첫 번째 Row */}
        <Row
          className="justify-content-center banner"
          style={{ margin: "30px", marginBottom: "50px", height: "150px" }}
        >
          <Col lg={4} className="text-center">
            <div className="text-containers" style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                찾으시는 레시피가 있으시나요?
              </div>
              <div style={{ fontWeight: "500", color: "#878787" }}>
                식재료로 레시피를 검색해보세요
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                className="form-control"
                placeholder="예) 토마토 파스타"
                style={{ width: "100%", maxWidth: "300px", margin: "0 auto" }}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValue(value);
                }}
              />
              <div style={{ marginTop: "5px" }}>
                <Button
                  variant="secondary"
                  style={{
                    backgroundColor: "rgb(241, 93, 24)",
                    border: "none",
                  }}
                  onClick={searchRecipe}
                >
                  검색
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* 비디오 결과 표시 Row */}
        <Row>
          {showSearchVideo ? (
            <h5 style={{ marginBottom: "10px" }}>
              검색 결과 {videoIds.length}
            </h5>
          ) : (
            ""
          )}
          <div style={{ fontSize: "16px", marginBottom: "10px" }}>
            {showSearchVideo && inputValue}
          </div>
          {showSearchVideo && videoIds.length > 0
            ? videoIds.map((id, index) => (
                <Col
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  key={index}
                  className="mb-4"
                  style={{ position: "relative" }}
                >
                  <YouTube
                    videoId={id}
                    opts={{ width: "100%", height: "210px" }}
                  />
                  <div
                    onClick={() => toggleLike(id)}
                    style={{
                      position: "absolute",
                      bottom: "15px",
                      right: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={heartStates[id] ? TrueHeart : FalseHeart} // 상태에 따른 이미지 변경
                      alt="heart icon"
                      width="24"
                      height="24"
                    />
                  </div>
                </Col>
              ))
            : null}
        </Row>

        {/* 두 번째 Row */}
        <Row className="justify-content-center">
          <h5 style={{ marginBottom: "50px" }}>
            나의 재료 {ingredients.length}
          </h5>
          {ingredients.map((ingredient) => (
            <Col
              className="item"
              lg={2}
              xs={4}
              key={ingredient.id}
              style={{ position: "relative" }}
            >
              <div>{ingredient.name}</div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default FindRecipe;
