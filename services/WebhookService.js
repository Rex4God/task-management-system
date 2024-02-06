"use strict";
const axios = require("axios");
const logger = require("../app/utils/logger");
const { StatusCodes } = require("http-status-codes");

const log = logger();


exports.notifyWebhooks = async (webhooks, payload) => {
  try {
    const notificationCount = {};

    const promises = webhooks.map(async (webhook) => {
      try {
        if (!notificationCount[webhook.url]) {
          notificationCount[webhook.url] = 1;
        } else if (notificationCount[webhook.url] < 5) {
          notificationCount[webhook.url]++;
        } else {
          log.info(`Notification limit reached for ${webhook.url}`);
          return {
            webhookUrl: webhook.url,
            notificationCount: notificationCount[webhook.url],
            error: 'Notification limit reached',
            statusCode: StatusCodes.TOO_MANY_REQUESTS, 
          };
        }

        setTimeout(async () => {
          try {
            const response = await axios.post(webhook.url, payload);

            return {
              webhookUrl: webhook.url,
              notificationCount: notificationCount[webhook.url],
              response: response
            };
          } catch (error) {
      
            log.error(`Error notifying ${webhook.url}: ${error.message}`);
            return {
              webhookUrl: webhook.url,
              notificationCount: notificationCount[webhook.url],
              error: error.message,
              statusCode: error.response ? error.response.status : StatusCodes.INTERNAL_SERVER_ERROR,
            };
          }
        }, 1000);
      } catch (error) {
  
        log.error(`Error setting up notification timer for ${webhook.url}: ${error.message}`);
        return {
          webhookUrl: webhook.url,
          notificationCount: notificationCount[webhook.url],
          error: error.message,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        };
      }
    });

    const results = await Promise.all(promises);
    return results;
  } catch (e) {
    log.error("An unknown error has occurred. Please try again later", e);
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};