package com.utils;

import com.oracle.javafx.jmx.json.JSONWriter;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;


/**
 * Created by allanjohnson on 10/28/15.
 */

public class Servlet extends javax.servlet.http.HttpServlet {
    @Override
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response)
            throws ServletException, IOException {
        String button = (String) request.getParameter("button");
        System.out.printf("Buton:  %s %n", button);
        DbConnection connection = new DbConnection();
        switch (button) {
            case "start":
                String jsonString = connection.initDb();
                response.setContentType("application/json");
                PrintWriter out = response.getWriter();
                out.print(jsonString);
                out.flush();
                break;
            case "end":
                connection.closeDb();
                break;
            case "correct":
                int id =  Integer.parseInt(request.getParameter("id"));
                int shownCount = Integer.parseInt(request.getParameter("shownCount"));
                int rightCount = Integer.parseInt(request.getParameter("rightCount"));
                int wrongCount = Integer.parseInt(request.getParameter("wrongCount"));
                int level = Integer.parseInt(request.getParameter("level"));
                int inARow = Integer.parseInt(request.getParameter("inARow"));

                connection.correctAnsInsert(id, shownCount,rightCount,wrongCount,level,inARow);
                break;
            case "wrong":
                connection.wrongAnsInsert();
                break;
            default:
                break;
        }

    }
    @Override
    public void init() throws ServletException
    {
        System.out.println("Servlet " + this.getServletName() + " has started.");
    }

    @Override
    public void destroy()
    {
        System.out.println("Servlet " + this.getServletName() + " has stopped.");
    }

}
