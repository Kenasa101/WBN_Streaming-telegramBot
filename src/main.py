#################################
#   Eurostreaming Telegram Bot  #
# Developed by @Non_Sono_Matteo #
#   https://matteosillitti.it   #
#       Github: @Matt0550       #
#################################

import sys
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update, Chat, Bot, WebAppInfo
from telegram.constants import ParseMode
from telegram.ext import Application, Updater, ContextTypes, MessageHandler, filters, CommandHandler
import json
import datetime
import dotenv
import logging
import os
import traceback
import html

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

# Load .env file
dotenv.load_dotenv()

TOKEN = os.getenv('token')
if not TOKEN:
    print("Error: No token provided. Check your environment variables.")
    sys.exit(1)
    
OWNER_ID = os.getenv('owner_id')

if not OWNER_ID:
    print("Error: No owner id provided. Check your environment variables.")
    sys.exit(1)

ENABLE_WEBAPP_SERVER = os.getenv('enable_webapp_server', True) # Required for miniapp
REPORT_ERRORS_OWNER = os.getenv('report_errors_owner', True) # Report errors to the owner

start_time = datetime.datetime.now()  # For the uptime command

# Create a decorator to apply cooldown to a function (in seconds) for user who used the command
def cooldown(seconds):
    def decorator(func):
        # Create a dictionary to store the last time the user used the command
        last_time = {}

        async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE):
            if update.message.text.startswith("/"):
                # Get the user id
                user_id = update.message.from_user.id
                # Get the current time
                now = datetime.datetime.now()
                # Check if the user has used the command before
                if user_id in last_time:
                    # Check if the user has used the command in the last seconds
                    if now - last_time[user_id] < datetime.timedelta(seconds=seconds):
                        # If the user has used the command in the last seconds, send a message to the user
                        await update.message.reply_text("You can use this command again in %s seconds" % str(
                            seconds - (now - last_time[user_id]).seconds))
                        # Return to avoid the function to be executed
                        return
                # Update the last time the user used the command
                last_time[user_id] = now
                # Execute the function
                await func(update, context)
        return wrapper
    return decorator

def no_group(func):
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE):
        # Check if bot is in a group
        if update.effective_chat.type == Chat.GROUP or update.effective_chat.type == Chat.SUPERGROUP:
            await update.message.reply_text(
                "This command cannot be used in a group")
        else:
            # Execute the function
            await func(update, context)
    return wrapper

async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log the error and send a telegram message to notify the developer."""
    # Log the error before we do anything else, so we can see it even if something breaks.
    logger.error("Exception while handling an update:", exc_info=context.error)

    # traceback.format_exception returns the usual python message about an exception, but as a
    # list of strings rather than a single string, so we have to join them together.
    tb_list = traceback.format_exception(None, context.error, context.error.__traceback__)
    tb_string = "".join(tb_list)

    # Build the message with some markup and additional information about what happened.
    # You might need to add some logic to deal with messages longer than the 4096 character limit.
    update_str = update.to_dict() if isinstance(update, Update) else str(update)
    message = (
        "An exception was raised while handling an update\n"
        f"<pre>update = {html.escape(json.dumps(update_str, indent=2, ensure_ascii=False))}"
        "</pre>\n\n"
        f"<pre>context.chat_data = {html.escape(str(context.chat_data))}</pre>\n\n"
        f"<pre>context.user_data = {html.escape(str(context.user_data))}</pre>\n\n"
        f"<pre>{html.escape(tb_string)}</pre>"
    )

    # Finally, send the message
    await context.bot.send_message(
        chat_id=OWNER_ID, text=message, parse_mode=ParseMode.HTML
    )

@cooldown(15)
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Check if bot is in a group
    if not update.message.chat.type == "group" or not update.message.chat.type == "supergroup":
        await update.message.reply_text(
            "Welcome to Eurostreaming Unofficial Telegram Bot\n\nOpen the mini app with this button", reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("Open Mini App", web_app=WebAppInfo(url="https://proxy-mac.cloud.matteosillitti.it"))]]))
    else:
        await update.message.reply_text(
            "This command cannot be used in a group")

@cooldown(15)
async def help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("""
    Eurostreaming Unofficial Telegram Bot\n
Commands:
- /start: Start the bot
- /help: Show this message
- /status: Show the bot status\n\n
This bot is an unofficial bot for Eurostreaming website.\n
You can open the mini app with the /start command.\n
This project is open source and free to use.
                                    
Developed by @Non_Sono_Matteo
https://matteosillitti.it
                                    
Source code: https://github.com/Matt0550/Eurostreaming-telegramBot
Buy me a coffee: https://buymeacoffee.com/Matt0550
""")

@cooldown(15)
async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Get the bot uptime widout microseconds
    uptime = datetime.datetime.now() - start_time
    uptime = str(uptime).split(".")[0]

    await update.message.reply_text("✅ If you see this message, the bot is working\n⏰ Uptime: %s" % str(
        uptime) + "\n\nThanks for using this bot.\nBuy me a coffee: https://buymeacoffee.com/Matt0550\nSource code: https://github.com/Matt0550/Eurostreaming-telegramBot", disable_web_page_preview=True)

def main() -> None:
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler('start', start))
    application.add_handler(CommandHandler('help', help))
    application.add_handler(CommandHandler('status', status))


    if REPORT_ERRORS_OWNER == True or REPORT_ERRORS_OWNER == "1" or REPORT_ERRORS_OWNER.lower() == "true":
        application.add_error_handler(error_handler)

    application.run_polling()

if __name__ == '__main__':
    print("Eurostreaming Unofficial Telegram Bot")
    print("Developed by @Non_Sono_Matteo")
    print("https://matteosillitti.it")
    
    # Webgui
    if ENABLE_WEBAPP_SERVER == True or ENABLE_WEBAPP_SERVER == "1" or ENABLE_WEBAPP_SERVER.lower() == "true":
        from gui import mainGUI
        from threading import Thread
        t = Thread(target=mainGUI)
        t.start()

    # Start bot
    main()