import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import "./Ingredient.style.css";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// AWS SDK 설정
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const Ingredient = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [itemCount, setItemCount] = useState(0); // 항목 수를 저장할 상태

  useEffect(() => {
    const fetchIngredients = async () => {
      const params = {
        TableName: "IngredientsTable",
      };

      try {
        const data = await dynamodb.scan(params).promise();
        setIngredients(data.Items);
        setItemCount(data.Count); // 항목 수 상태에 저장
      } catch (error) {
        console.error("Error fetching ingredients: ", error);
      }
    };

    fetchIngredients();
  }, []);

  const addIngredient = async () => {
    if (newIngredient.trim()) {
      const params = {
        TableName: "IngredientsTable",
        Item: {
          id: new Date().getTime().toString(),
          name: newIngredient,
        },
      };

      console.log("Params being sent to DynamoDB:", params);

      try {
        await dynamodb.put(params).promise();
        console.log("Data successfully added to DynamoDB");
        setIngredients([...ingredients, params.Item]);
        setNewIngredient("");
        setShowModal(false);
      } catch (error) {
        console.error("Error adding ingredient: ", error);
      }
    }
  };

  const deleteIngredient = async (id) => {
    const params = {
      TableName: "IngredientsTable",
      Key: {
        id: id,
      },
    };

    try {
      await dynamodb.delete(params).promise();
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
      setItemCount(itemCount - 1); // 항목 수 감소
    } catch (error) {
      console.error("Error deleting ingredient: ", error);
    }
  };

  return (
    <div className="container">
      <div
        style={{ marginLeft: "30px", display: "flex", marginBottom: "40px" }}
      >
        <div style={{ marginRight: "30px", marginTop: "30px" }}>
          <h5>나의 재료 ({itemCount})</h5> {/* 항목 수를 표시 */}
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="outline-dark"
          style={{
            width: "96px",
            height: "40px",
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          재료 추가
        </Button>
      </div>

      <Container style={{ marginTop: "30px", borderTop: "1px solid #D9D9D9" }}>
        <Row>
          {ingredients.map((ingredient) => (
            <Col
              className="item"
              lg={2}
              xs={4}
              key={ingredient.id}
              style={{ position: "relative" }}
            >
              <div>
                {ingredient.name}
                <i
                  className="fi fi-bs-x"
                  onClick={() => deleteIngredient(ingredient.id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    fontSize: "10px",
                    color: "black",
                    cursor: "pointer",
                  }}
                ></i>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="close-button">
          <Modal.Title>재료 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="재료 이름"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="Secondary" onClick={() => setShowModal(false)}>
            닫기
          </Button>
          <Button className="add-button" onClick={addIngredient}>
            추가
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ingredient;
