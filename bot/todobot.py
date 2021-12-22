from telegram.ext import *
from coder import encodeDict
import requests

EXPECT_USERNAME, EXPECT_PASSWORD = range(2)


def get_user_info(update, context):
    update.message.reply_text("Hi there " + u"\U0001F44B" + "\nI'm Teddi, the to-do bot. "
                              "I can add tasks to your to-do list if you trust me " + u"\U0001F609" +
                              "\nWhat's your username?")
    return EXPECT_USERNAME


def handle_message(update, context):
    if 'username' in context.user_data.keys():
        username = context.user_data['username']
        text = update.message.text
        params = {'username': username, 'description': text}
        requests.post('http://localhost:3001/api/add', data=encodeDict(params))
        update.message.reply_text("Added " + u"\U0001F44D")
        return ConversationHandler.END
    update.message.reply_text("Oh man, looks like our connection was lost " + u"\U0001F62D" +
                              "\nPlease send your username again")
    return EXPECT_USERNAME


def get_username(update, context):
    username = update.message.text
    params = {'username': username}
    res = requests.get('http://localhost:3001/api/checkUsername', params=encodeDict(params))
    if res.text == 'true':
        context.user_data['username'] = username
        update.message.reply_text(f"Hi {username}, nice to see you! What's your password?")
        return EXPECT_PASSWORD
    else:
        update.message.reply_text(f"Sorry, I don't know anyone called {username}, please tell me your active username or "
                                  "go to http://132.69.8.12 to create a one and come back to tell me")
        return EXPECT_USERNAME


def get_password(update, context):
    password = update.message.text
    username = context.user_data['username']
    params = {'username': username, 'password':password}
    res = requests.get('http://localhost:3001/api/login', params=encodeDict(params))

    #  check if this user-password combo is correct
    if res.text == 'true':
        update.message.reply_text("Yay, we're now connected, enjoy!")
        return ConversationHandler.END
    else:
        del context.user_data['username']
        update.message.reply_text("Hey! don't try to trick me! that's not the password" + u"\U0001F621" +
                                  "\nLet's start over - what's your username?")
        return EXPECT_USERNAME


def unsupported(update, context):
    update.message.reply_text("FYI, this can't be added to your to-do list, "
                              "but you can still send it to me " + u"\U0001F604")


def badCredentials(update, context):
    update.message.reply_text("This has nothing to do with connecting to your account "
                              + u"\U0001F621" + " please send me your username")
    return EXPECT_USERNAME


def main():
    updater = Updater(API_KEY, use_context=True)
    dp = updater.dispatcher
    dp.add_handler(ConversationHandler(entry_points=[CommandHandler("start", get_user_info),
                                                     MessageHandler(Filters.text, handle_message)],
                                       states={
                                           EXPECT_USERNAME: [MessageHandler(Filters.text, get_username)],
                                           EXPECT_PASSWORD: [MessageHandler(Filters.text, get_password)]
                                       }, fallbacks=[MessageHandler(~Filters.text & ~Filters.command, badCredentials)]))
    dp.add_handler(MessageHandler(~Filters.text & ~Filters.command, unsupported))
    updater.start_polling()
    updater.idle()


main()
