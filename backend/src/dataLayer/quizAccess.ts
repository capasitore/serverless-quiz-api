import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { QuizItem } from '../models/QuizItem'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk')
const logger = createLogger('quizAccess')
const XAWS = AWSXRay.captureAWS(AWS)

/**
* A class to perform operation on DynamoDB tables.
* @constructor
* @param {DocumentClient} docClient a client to operate on DynamoDB
* @param {string} quizzesTable the name of the table with the quizzes
* @param {string} userIdIndex  the name of the index that stores the user's id
*/
export class QuizAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly quizzesTable = process.env.QUIZ_TABLE,
        private readonly userIdIndex = process.env.INDEX_NAME) {
    }
     /**
     * Gets quiz items by user id from DynamoDB
     * @param {string} userId user's id
     * @returns {QuizItem[]} an array of quizzes
     */
    async getQuizzes(userId: string): Promise<QuizItem[]> {
        logger.info('Getting quiz items by user id')

        const result = await this.docClient.query({
            TableName: this.quizzesTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as QuizItem[]
    }

}