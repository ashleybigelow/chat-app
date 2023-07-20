import moment from "moment";

function formatMessage(username, message) {
  return{
    username, message, time: moment().format('h:mm a')
  };
};

export default formatMessage;