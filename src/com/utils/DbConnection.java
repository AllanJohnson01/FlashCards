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
    private int USER = 2;
    public String initDb(){
        StringBuffer initDBData = new StringBuffer("[");
        try {
            //Get a connnection to the database
            Class.forName("com.mysql.jdbc.Driver");
            Connection fcConnection = DriverManager.getConnection("jdbc:mysql://localhost:3306/flash_card_db", "root", "test");
            //Create a statement object
            Statement statement = fcConnection.createStatement();
            //Execute the query
            ResultSet rs = statement.executeQuery("SELECT Users_Cards.cards_id," +
                    " Cards.frontSide," +
                    " Cards.backSide, shownCount," +
                    " rightCount, wrongCount," +
                    " level, inARow from Users_Cards \n" +
                    "INNER JOIN Cards\n" +
                    "ON Users_Cards.cards_id=Cards.cards_id\n" +
                    "where users_id = " + USER + ";");
            //Process the result
            //****List<Card> dbCards = new ArrayList<>();

            while (rs.next()){
                initDBData.append("{\"id\": " + rs.getString("cards_id")+ ", ");
                initDBData.append("\"front\": \""+rs.getString("frontSide") + "\", ");
                initDBData.append("\"back\": \""+rs.getString("backSide") + "\", ");
                initDBData.append("\"shownCount\": "+rs.getString("shownCount") + ", ");
                initDBData.append("\"rightCount\": "+rs.getString("rightCount") + ", ");
                initDBData.append("\"wrongCount\": "+rs.getString("wrongCount") + ", ");
                initDBData.append("\"inARow\": "+rs.getString("inARow") + ", ");
                if (rs.isLast() != true) {
                    initDBData.append("\"level\": " + rs.getString("level") + "}, ");
                } else {
                    initDBData.append("\"level\": " + rs.getString("level") + "}]");
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
            Connection fcConnection = DriverManager.getConnection("jdbc:mysql://localhost:3306/flash_card_db", "root", "test");
            //Create a statement object
            Statement statement = fcConnection.createStatement();
            //Execute the query
            int rs = statement.executeUpdate("UPDATE Users_Cards SET shownCount=" + shownCount +
                    ",rightCount=" + rightCount +
                    ",wrongCount=" + wrongCount +
                    ",level=" + level +
                    ",inARow=" + inARow +
                    " WHERE cards_id=" + id +
                    " And users_id = " + USER + ";");
            System.out.println("Update query: " + rs);
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
