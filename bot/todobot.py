API_KEY = "5017229605:AAFWf69K347B0GRwI4rdCPcYRIGU1h_8pPc"

from telegram.ext import *
from coder import encodeDict
import requests

GET_USER_INFO, EXPECT_USERNAME, EXPECT_PASSWORD = range(3)


def get_user_info(update, context):
    update.message.reply_text("Please enter your username")
    return EXPECT_USERNAME


def get_username(update, context):
    username = update.message.text
    params = {'username': username}
    res = requests.get('http://localhost:3001/api/checkUsername', params=encodeDict(params))
    if res.text == 'true':
        context.user_data['username'] = username
        update.message.reply_text("Please enter your password")
        return EXPECT_PASSWORD
    else:
        update.message.reply_text("No such user, go to http://132.69.8.12 to create a user then come back "
                                  "to give your username")
        return EXPECT_USERNAME


def get_password(update, context):
    password = update.message.text
    username = context.user_data['username']
    params = {'username': username, 'password':password}
    res = requests.get('http://localhost:3001/api/login', params=encodeDict(params))

    #  check if this user-password combo is correct
    if res.text == 'true':
        update.message.reply_text("You are now connected, enjoy!")
        return ConversationHandler.END
    else:
        del context.user_data['username']
        update.message.reply_text("That password is incorrect, Please re-enter your username")
        return EXPECT_USERNAME


def handle_message(update, context):
    username = context.user_data['username']
    text = update.message.text
    params = {'username':username, 'description':text}
    requests.post('http://localhost:3001/api/add', data=encodeDict(params))
    update.message.reply_text(f"Added {text} to your to-do list")


def main():
    updater = Updater(API_KEY, use_context=True)
    dp = updater.dispatcher
    dp.add_handler(ConversationHandler(entry_points=[CommandHandler("start", get_user_info)],
                                       states={
                                           GET_USER_INFO: [MessageHandler(Filters.text, get_user_info)],
                                           EXPECT_USERNAME: [MessageHandler(Filters.text, get_username)],
                                           EXPECT_PASSWORD: [MessageHandler(Filters.text, get_password)]

                                       },fallbacks=[]))
    # dp.add_handler(CommandHandler("start", get_user_info))
    dp.add_handler(MessageHandler(Filters.text, handle_message))

    updater.start_polling()
    updater.idle()


main()
