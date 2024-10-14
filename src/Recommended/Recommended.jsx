import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import YouTube from "react-youtube";
import axios from "axios";
import "./Recommended.style.css";
const Recommended = () => {
  const [popularVideo, setPopularVideo] = useState([]);
  const toggleLike = () => {};
  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: "snippet", // 기본 정보만 가져오기
              q: "레시피", // 레시피 키워드로 검색
              type: "video", // 비디오만 검색
              order: "viewCount", // 조회수가 많은 순으로 정렬
              maxResults: 10, // 최대 10개의 결과만 가져오기
              regionCode: "KR", // 한국에서 인기 있는 레시피
              key: apiKey, // YouTube API 키
            },
          }
        );

        console.log("인기 있는 레시피 비디오", response.data.items);
        const recipeVideos = response.data.items.map((video) => ({
          videoId: video.id.videoId, // 비디오 ID
          title: video.snippet.title, // 비디오 제목
        }));
        setPopularVideo(recipeVideos);
      } catch (error) {
        console.error("YouTube API 요청 중 오류 발생: ", error);
      }
    };
    fetchPopularRecipes();
  }, []);

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
          <h2>추천 레시피</h2>
          <p className="descripition" style={{ fontSize: "18px" }}>
            조회수를 기준으로 선정된 인기 많은 요리 영상입니다. 다양한 레시피를
            통해 맛있는 음식을 만들어 보세요!
          </p>
        </div>

        {popularVideo.map((video, index) => (
          <div key={video.videoId} style={{ display: "flex" }}>
            <div style={{ marginBottom: "30px" }}>
              <YouTube
                videoId={video.videoId} // 여기서도 video.videoId로 수정
                opts={{ width: "100%", height: "210px" }}
              />
              <div
                onClick={() => toggleLike()}
                style={{
                  position: "absolute",
                  bottom: "15px",
                  right: "20px",
                  cursor: "pointer",
                }}
              ></div>
            </div>
            <div
              style={{
                marginRight: "10px",
                display: "flex", // Flexbox 사용
                justifyContent: "center", // 가로 방향 가운데 정렬
                alignItems: "center",
                height: "210px",
                fontSize: "20px",
                wordWrap: "break-word",
                maxWidth: "600px",
                whiteSpace: "normal",
                padding: "50px",
                marginLeft: "30px",
              }}
            >
              {video.title}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Recommended;
