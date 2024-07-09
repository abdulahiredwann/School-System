import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

interface UpdateResultsProps {
  studentId: string;
  subjectId: string;
  studentName: string;
  exams: {
    midExam1: number | null;
    midExam2: number | null;
    finalExam: number | null;
  };
  closeModal: () => void;
  updateResults: (exams: {
    midExam1: number | null;
    midExam2: number | null;
    finalExam: number | null;
  }) => void;
}

const UpdateResults: React.FC<UpdateResultsProps> = ({
  studentId,
  subjectId,
  studentName,
  exams,
  closeModal,
  updateResults,
}) => {
  const [midExam1, setMidExam1] = useState<number | null>(exams.midExam1);
  const [midExam2, setMidExam2] = useState<number | null>(exams.midExam2);
  const [finalExam, setFinalExam] = useState<number | null>(exams.finalExam);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateResults({ midExam1, midExam2, finalExam });
    closeModal();
  };

  return (
    <Modal show onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Results for {studentName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formMidExam1">
            <Form.Label>Mid Exam 1</Form.Label>
            <Form.Control
              type="number"
              value={midExam1 ?? ""}
              onChange={(e) =>
                setMidExam1(e.target.value ? parseInt(e.target.value) : null)
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMidExam2">
            <Form.Label>Mid Exam 2</Form.Label>
            <Form.Control
              type="number"
              value={midExam2 ?? ""}
              onChange={(e) =>
                setMidExam2(e.target.value ? parseInt(e.target.value) : null)
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFinalExam">
            <Form.Label>Final Exam</Form.Label>
            <Form.Control
              type="number"
              value={finalExam ?? ""}
              onChange={(e) =>
                setFinalExam(e.target.value ? parseInt(e.target.value) : null)
              }
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateResults;
