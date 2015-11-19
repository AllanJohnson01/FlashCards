<%--
  Created by IntelliJ IDEA.
  User: allanjohnson
  Date: 10/27/15
  Time: 6:41 PM
  To change this template use File | Settings | File Templates.
--%>
<%!
  private static final String DEFAULT_USER = "Guest";
%>
<%
  String user = request.getParameter("user");
  if(user == null)
    user = DEFAULT_USER;
%>
<%
    /*String fName = request.getParameter("fname");
    String lName = request.getParameter("lname");
    System.out.printf("This did work Mr. %s %s%n", fName, lName);*/

%>


<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>FlashCard App</title>

    <script type="text/javascript" src="./JS/p5/p5.min.js" charset="UTF-8"></script>
    <script type="text/javascript" src="./JS/p5/addons/p5.dom.js" charset="UTF-8"></script>
    <script type="text/javascript" src="./JS/Card.js" charset="UTF-8"></script>
    <link rel="stylesheet" type="text/css" href="./CSS/style.css">
  </head>
  <body>
    <div>
      Hello, <%= user %>!<br /><br />
      <form action="index.jsp" method="POST">
        Enter your name:<br />
        <input type="text" name="user" /><br />
        <input type="submit" value="Submit" />
      </form>
    </div>
    <canvas id="mainCanvas"></canvas>
  </body>
</html>
