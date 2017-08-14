package com.kepler.rominfo.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class Authorization {

    private static final Log LOGGER = LogFactory.getLog(Authorization.class);

    public static Map<String, ArrayList<String>> getRights() {
        Map<String, ArrayList<String>> authorizations = new HashMap<>();
        ArrayList<String> adminActions = new ArrayList<String>();
        ArrayList<String> professorActions = new ArrayList<String>();
        ArrayList<String> studentActions = new ArrayList<String>();

        if (Authorization.class.getClassLoader().getResource("authorization.xml") != null) {
            try {
                String urlToFile = String.valueOf(Authorization.class.getClassLoader().getResource("authorization.xml"));
                DocumentBuilderFactory dbFactory
                        = DocumentBuilderFactory.newInstance();
                DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
                Document doc = dBuilder.parse(urlToFile);
                doc.getDocumentElement().normalize();
                NodeList roles = doc.getElementsByTagName("role");
                for (int roleIndex = 0; roleIndex < roles.getLength(); roleIndex++) {
                    Node role = roles.item(roleIndex);
                    if (role.getNodeType() == Node.ELEMENT_NODE) {
                        Element eElement = (Element) role;
                        String userRole = eElement.getAttribute("id");
                        NodeList actions = eElement.getElementsByTagName("action");
                        for (int actionIndex = 0; actionIndex < actions.getLength(); actionIndex++) {
                            Node action = actions.item(actionIndex);
                            if (action.getNodeType() == Node.ELEMENT_NODE) {
                                Element eElement2 = (Element) action;
                                String actionAllowed = eElement2.getTextContent();
                                switch (userRole) {
                                    case "Admin":
                                        adminActions.add(actionAllowed);
                                        break;
                                    case "Professor":
                                        professorActions.add(actionAllowed);
                                        break;
                                    default:
                                        studentActions.add(actionAllowed);
                                        break;
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                LOGGER.error(e.getMessage());
                e.printStackTrace();
            }

            authorizations.put("Admin", adminActions);
            authorizations.put("Professor", professorActions);
            authorizations.put("Student", studentActions);
        }
        return authorizations;
    }

}