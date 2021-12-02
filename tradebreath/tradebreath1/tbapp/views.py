from django.http import HttpResponse
from alpaca_trade_api.rest import REST
from alpaca_trade_api.rest import TimeFrame
import alpaca_trade_api as tradeapi
import datetime
import requests

# ALPACA API KEYS
# os.environ['APCA_API_KEY_ID'] = 'PK87MNNJ3DIDGDHWMTH6'
# os.environ['APCA_API_SECRET_KEY'] = 'r8llTDlXflevWpchpjkqGPHLA5QYxIRs7tfCUY6n'
api = tradeapi.REST(key_id='PK87MNNJ3DIDGDHWMTH6', secret_key='r8llTDlXflevWpchpjkqGPHLA5QYxIRs7tfCUY6n', base_url="https://paper-api.alpaca.markets")

# ALPACA AVAILABLE INTERVALS FOR CANDLESTICKS
AVAILABLE_INTERVALS = {'Day': TimeFrame.Day,
                       'Hour': TimeFrame.Hour,
                       'Minute': TimeFrame.Minute,
                       'Sec': TimeFrame.Sec} #Sec is no longer available

#This function inverts stock splits
def change(my_bars, s):
  response = requests.get("https://financialmodelingprep.com/api/v3/stock_split_calendar?from=2020-12-01&to=2021-12-01&apikey=60a8602443e6b0e10151f151fe7c3fd4")
  stock_splits = (response.json())
  for x in stock_splits:
    if s == x['symbol']:
      #print(x['symbol'])
      #print("num", x['numerator'])
      #print("den", x['denominator'])
      for bar_num in range(0, len(my_bars)):
        if str(my_bars[bar_num]['t']) < x['date']: 
            my_bars[bar_num]['c'] = my_bars[bar_num]['c'] * (x['denominator'] / x['numerator']) 
            my_bars[bar_num]['o'] = my_bars[bar_num]['o'] * (x['denominator'] / x['numerator'])
            my_bars[bar_num]['l'] = my_bars[bar_num]['l'] * (x['denominator'] / x['numerator'])
            my_bars[bar_num]['h'] = my_bars[bar_num]['h'] * (x['denominator'] / x['numerator'])
      break
  return my_bars
  
# THIS FUNCTION CALLS ALPACA API AND STOCK NEWS API
def get_alpaca_info(stock, interval, start, end):
  if interval not in AVAILABLE_INTERVALS:
    raise Exception("Interval not supported.")

  response = requests.get("https://stocknewsapi.com/api/v1?tickers=" + stock + "&items=25&token=c5nrxp6lw6ftwokpjx08wkycksgzcg0rpgc4hlcy")
  news = (response.json())
  a = api.get_bars(stock, AVAILABLE_INTERVALS[interval], start, end)._raw
  a = change(a, stock)
  return a, news
  


# THIS PARSES THE QUERY PARAMS FROM THE CLIENT.
# Optional end_date, inject yesterday if not provided.
def parse_query_params(stock, interval, start_date, end_date= None):
  if not (start_date and stock and interval):
    raise Exception("Missing query params.")

  if end_date is None:
    end_date = str(datetime.date.today() - datetime.timedelta(days=2)) #2 day time delay because of time zones FIX THIS

  return {"stock": stock[0], "interval": interval[0], "start_date": start_date[0], "end_date": end_date}

# THIS IS FIRST FUNCTION CALLED.
def view_bars(request):
  parsed_params = parse_query_params(**request.GET)

  return HttpResponse(get_alpaca_info(parsed_params['stock'], parsed_params['interval'], parsed_params['start_date'], parsed_params['end_date']))

#get_linechart_data: returns an array of timestamps and the vwap value
def get_linechart_data(bars): #Use this on the output of api.get_bars
    data = bars.df
    arr = []
    for x in data.itertuples():
      ts = x.Index
      arr.append((ts.strftime('%Y-%m-%d %X'), x.vwap))
    return arr

#get_candlestick_data: returns an array of timestamp and low,high,open, and close prices
def get_candlestick_data(bars): #Use this on the output of api.get_bars
    data = bars.df
    arr = []
    for x in data.itertuples():
      ts = x.Index
      arr.append((ts.strftime('%Y-%m-%d %X'), x.low, x.high, x.open, x.close))
    return arr

MOST_RECENT_TIME = str(datetime.datetime.now() - datetime.timedelta(minutes=16))[0:10] + "T" + str(datetime.datetime.now() - datetime.timedelta(minutes=16))[11:19] + "Z"



#finds "last_week", timeframe in which metrics are pulled from
def days_offset_fun(RIGHT_NOW):
  market_open = datetime.time(13,31)

  if RIGHT_NOW.weekday() == 0 and RIGHT_NOW.time() < market_open:
    days_offset = 8
  elif RIGHT_NOW.weekday() == 0 and RIGHT_NOW.time() > market_open:
    days_offset = 1
  else:
    days_offset = RIGHT_NOW.weekday() + 1
  return days_offset


days_offset_var = days_offset_fun(datetime.datetime.now() - datetime.timedelta(minutes=16))

my_time = datetime.datetime.now() - datetime.timedelta(minutes=16) - datetime.timedelta(days=days_offset_var)

last_week= str(my_time)[0:10] + "T" + str(my_time)[11:19]+ "Z"


#most recent day's close
def last_day_close_fun(stock):
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  last_day_close= last_week_day_bars[-1].c
  return "Last Day Close", last_day_close

#most recent day's open
def last_day_open_fun(stock):
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  last_day_open= last_week_day_bars[-1].o
  return "Last Day Open", last_day_open

def last_day_dollar_change_fun(stock):
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  last_day_dollar_change = round(last_week_day_bars[-1].c - last_week_day_bars[-1].o, 2)
  return "Last Day Dollar Change", last_day_dollar_change

#most recent day's close minus open as a percentage of most recent day's open
def last_day_perc_change_fun(stock):
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  last_day_dollar_change = last_week_day_bars[-1].c - last_week_day_bars[-1].o
  last_day_perc_change = (last_day_dollar_change / last_week_day_bars[-1].o) * 100
  return "Last Day Percent Change", last_day_perc_change

#most recent day's volume
def last_day_volume_fun(stock):
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  last_day_volume = last_week_day_bars[-1].v
  return "Last Day Volume", last_day_volume

#most recent days's low
def last_day_low_fun(stock):
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  last_day_low = last_week_day_bars[-1].l
  return "Last Day Low", last_day_low

#most recent day's high
def last_day_high_fun(stock):
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  last_day_high = last_week_day_bars[-1].h
  return "Last Day High", last_day_high


#ONE YEAR AGO DATETIME FOR ONE_YEAR_AGO FUNCTIONS
one_year_ago_today = datetime.datetime.now() - datetime.timedelta(days=365)

one_year_ago_today_str = str(one_year_ago_today - datetime.timedelta(minutes=16))[0:10] + "T" + str(one_year_ago_today - datetime.timedelta(minutes=16))[11:19] + "Z"


#"ALMOST" ONE YEAR DATA NO LONGER USED - DELETE NEXT TIME YOU HAVE VIEWS RUNNING
almost_one_year_ago_today = datetime.datetime.now() - datetime.timedelta(days=364)

almost_one_year_ago_today_str = str(almost_one_year_ago_today - datetime.timedelta(minutes=16))[0:10] + "T" + str(almost_one_year_ago_today - datetime.timedelta(minutes=16))[11:19] + "Z"

#change in price over one year as a percentage of one_year_ago today's close
def one_year_change_fun(stock):
  one_year_ago_today_bars = api.get_bars(stock, TimeFrame.Day, one_year_ago_today_str, MOST_RECENT_TIME)
  one_year_ago_today_close = one_year_ago_today_bars[0].c
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  last_day_close= last_week_day_bars[-1].c
  one_year_change_per = (last_day_close - one_year_ago_today_close) / one_year_ago_today_close * 100
  return "One Year Percent Change", one_year_change_per

#highest price over last year
def one_year_high_fun(stock):
  one_years_bars = api.get_bars(stock, TimeFrame.Day, one_year_ago_today_str, MOST_RECENT_TIME)
  one_years_highs = []
  for i in range(0, len(one_years_bars)-1):
    one_years_highs.append(one_years_bars[i].h)
  one_year_high = max(one_years_highs)
  return "52 Week High", one_year_high

#lowest price over past year
def one_year_low_fun(stock):
  one_years_bars = api.get_bars(stock, TimeFrame.Day, one_year_ago_today_str, MOST_RECENT_TIME)
  one_years_lows = []
  for i in range(0, len(one_years_bars)-1):
    one_years_lows.append(one_years_bars[i].l)
  one_year_low = min(one_years_lows)
  return "52 Week Low", one_year_low

#filters list of stocks based on most recent day's volume
def filter_volume(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = last_day_volume_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

#filters list of stocks based on most recent day's close
def filter_close(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = last_day_close_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

#filters list of stocks based on most recent day's open
def filter_open(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = last_day_open_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

 #filters list of stocks based on most recent day's change in dollar price
def filter_dollar_change(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = last_day_dollar_change_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

 #filters list of stocks based on most recent day's change in percentage based price
def filter_perc_change(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = last_day_perc_change_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

 #filters list of stocks based on most recent day's low
def filter_low(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = last_day_low_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

 #filters list of stocks based on most recent day's high
def filter_high(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = last_day_high_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

 #filters list of stocks based on last year's change in percentage based price
def filter_one_year_change(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = one_year_change_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

#filters list of stocks based on last year's high
def filter_one_year_high(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = one_year_high_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

#filters list of stocks based on last year's low
def filter_one_year_low(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = one_year_low_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks

#filters list of stocks based on last day's change in dollar based price change
def filter_daysRange(stocks):
  stockDict = {}
  for x in stocks:
    stockDict[x] = last_day_high_fun(x)[1] - last_day_low_fun(x)[1]
  sort_stocks = sorted(stockDict.items(), key=lambda x: x[1], reverse=True)
  return sort_stocks


#returns data from last five trading days
def five_days(stock):
  last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_week, MOST_RECENT_TIME)
  le = len(last_week_day_bars)
  if (le >= 5):
       return (last_week_day_bars)[(le - 5):le]
  else:
       last_week_day_bars = api.get_bars(stock, TimeFrame.Day, last_2weeks, MOST_RECENT_TIME)
       return (last_week_day_bars)[(le - 5):le]
