from pandas import read_excel as read_excel
import time
from sys import argv as argv

now = time.time()
json_str = '{'

try:
	if len(argv) < 2:
		raise Exception('You need to pass in an xlsb filename')

	for i in range(1,len(argv)):
		filename = argv[i]
		json_str = json_str + "\"fileName:\""+str(filename)
		print("\nvalue of i: "+str(i))
		while i <len(argv)-1:
			if len(argv[i+1]) <6 or argv[i+1][-5:] != '.xlsb':
				#is sheet name
				i=i+1
				sheetName = argv[i]
				df = read_excel(filename,sheet_name = sheetName, engine = 'pyxlsb')
				df.to_csv(filename[0:-5]+str(sheetName)+str(time.time())[-4:]+'.csv')
				json_str = json_str+ ", \"sheets\":{"+ str(sheetName)+": {\"noOfRows\": "+str(len(df))+"}"
			else:
				break
		json_str = json_str + "},\"pTime\": "+str(time.time()- now)+"s,\"error\": \"Success\"}"


except Exception as exp:
    print("Exception: "+exp.args[0])
except:
	print(sys.exc_info()[0])
finally:
	print("now: " + str(now)+ "later: " + str(time.time()) + "now: " + str(time.time()- now))
	print("json str: "+str(json_str))
