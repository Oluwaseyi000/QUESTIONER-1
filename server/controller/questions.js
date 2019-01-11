import { validationResult } from 'express-validator/check';
import Question from '../models/questions';
import Meetup from '../models/meetup';
import util from '../helper/util';

/**
 * create a question controller class
 */
export default class questionController {
  /**
   * @param {object} req - the request object sent from router
   * @param {object} res - response object
   */
  static createQuestion(req, res) { // handles the creation of new question
    const {
      createdBy, meetup, title, body,
    } = req.body;
    const meetupCheck = Meetup.findMeetup(meetup);
    if (meetupCheck === -1) {
      return res.status(404).json({
        status: 404,
        error: 'Meetup does not exist',
      });
    }
    const error = validationResult(req);
    util.errorCheck(error, res);
    const question = new Question();
    question.create(createdBy, meetup, title, body);
    return res.status(201).json({ status: 201, data: question });
  }

  static upvote(req, res) {
    const { questionId } = req.params;
    const upvote = Question.upvote(questionId);
    if (upvote < 0) {
      return res.status(404).json({ status: 404, error: 'This question does not exist' });
    }
    return res.status(200).json({ status: 200, data: upvote });
  }

  static downvote(req, res) {
    const { questionId } = req.params;
    const downvote = Question.downvote(questionId);
    if (downvote < 0) {
      return res.status(404).json({ status: 404, error: 'This question does not exist' });
    }
    return res.status(200).json({ status: 200, data: downvote });
  }
}
