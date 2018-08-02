

//import java.io.BufferedReader;
//import java.io.IOException;
import java.io.InputStreamReader;
//import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

HttpURLConnectionExample HTTPRequest;

void setup() {
  HTTPRequest = new HttpURLConnectionExample("http://metagods.herokuapp.com/api/results");
  try {
    HTTPRequest.sendGET();
  } catch (IOException e) {
    println(e);
  }
}

static class HttpURLConnectionExample {
  static String GET_URL;
  HttpURLConnectionExample(String GET_URL) {
    this.setURL(GET_URL);
  }
  void setURL(String url) {
    GET_URL = url;
    
  }
  void sendGET() throws IOException {
    URL obj = new URL(GET_URL);
    HttpURLConnection con = (HttpURLConnection) obj.openConnection();
    con.setRequestMethod("GET");
    int responseCode = con.getResponseCode();
    System.out.println("GET Response Code :: " + responseCode);
    if (responseCode == HttpURLConnection.HTTP_OK) { // success
      BufferedReader in = new BufferedReader(new InputStreamReader(
          con.getInputStream()));
      String inputLine;
      StringBuffer response = new StringBuffer();

      while ((inputLine = in.readLine()) != null) {
        response.append(inputLine);
      }
      in.close();

      // print result
      System.out.println(response.toString());
    } else {
      System.out.println("GET request not worked");
    }

  }
}
