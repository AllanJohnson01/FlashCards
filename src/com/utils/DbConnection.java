package com.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by allanjohnson on 10/30/15.
 */
public class DbConnection {
    public String initDb(){
        StringBuffer initDBData = new StringBuffer("[");
        try {
            //Get a connnection to the database
            Class.forName("com.mysql.jdbc.Driver");
            Connection fcConnection = DriverManager.getConnection("jdbc:mysql://localhost:3306/flash_cards_db", "root", "test");
            //Create a statement object
            Statement statement = fcConnection.createStatement();
            //Execute the query
            ResultSet testResultSet = statement.executeQuery("SELECT * from Cards");
            //Process the result
            //****List<Card> dbCards = new ArrayList<>();

            while (testResultSet.next()){
                initDBData.append("{\"id\": "+testResultSet.getString("idCards") + ", ");
                initDBData.append("\"front\": \""+testResultSet.getString("front") + "\", ");
                initDBData.append("\"back\": \""+testResultSet.getString("backside") + "\", ");
                initDBData.append("\"shownCount\": "+testResultSet.getString("shownCount") + ", ");
                initDBData.append("\"rightCount\": "+testResultSet.getString("rightCount") + ", ");
                initDBData.append("\"wrongCount\": "+testResultSet.getString("wrongCount") + ", ");
                initDBData.append("\"inARow\": "+testResultSet.getString("inARow") + ", ");
                if (testResultSet.isLast() != true) {
                    initDBData.append("\"level\": " + testResultSet.getString("level") + "}, ");
                } else {
                    initDBData.append("\"level\": " + testResultSet.getString("level") + "}]");
                }
            }
            System.out.println(initDBData);
        } catch (Exception exc) {
            System.out.println("In the exception block %n");
            exc.printStackTrace();
        }
        return initDBData.toString();
    }
    public void correctAnsInsert(int id, int shownCount, int rightCount, int wrongCount, int level, int inARow){
        System.out.println("Got into DBDriver %n");
        try {
            //Get a connnection to the database
            Class.forName("com.mysql.jdbc.Driver");
            Connection fcConnection = DriverManager.getConnection("jdbc:mysql://localhost:3306/flash_cards_db", "root", "test");
            //Create a statement object
            Statement testStatement = fcConnection.createStatement();
            //Execute the query
            int testResultSet = testStatement.executeUpdate("UPDATE Cards SET shownCount=" + shownCount +
                    ",rightCount=" + rightCount +
                    ",wrongCount=" + wrongCount +
                    ",level=" + level +
                    ",inARow=" + inARow +
                    " WHERE idCards=" + id + ";");
            System.out.println("Update query: " + testResultSet);
        } catch (Exception exc) {
            System.out.println("In the exception block %n");
            exc.printStackTrace();
        }
    }
    public void wrongAnsInsert(){
        System.out.println("Got into DBConnection");
        try {
            //Get a connnection to the database
            Class.forName("com.mysql.jdbc.Driver");
            Connection fcConnection = DriverManager.getConnection("jdbc:mysql://localhost:3306/flash_cards_db", "root", "test");
            //Create a statement object
            Statement testStatement = fcConnection.createStatement();
            //Execute the query
            ResultSet testResultSet = testStatement.executeQuery("SELECT * from users");
            //Process the result
            while (testResultSet.next()){
                System.out.printf("Hello from wrong db method %n");
            }

        } catch (Exception exc) {
            System.out.println("In the exception block %n");
            exc.printStackTrace();
        }
    }
    public void closeDb(){
        System.out.println("Hi from CloseDb %n");
    }
}
