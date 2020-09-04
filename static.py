import urllib.request
import zipfile

static_data_url = 'http://web.mta.info/developers/data/nyct/subway/google_transit.zip'
file_name = 'mta-subway-static.zip'
static_data_dir = './mta-subway-static'

urllib.request.urlretrieve(static_data_url, file_name)

with zipfile.ZipFile(file_name, 'r') as zip_ref:
    # zip_ref.extractall(static_data_dir)
    zip_ref.extract('stops.txt', static_data_dir)
