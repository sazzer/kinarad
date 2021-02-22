Feature: Get user details

  Scenario: Get unknown user
    When I get the user "unknown"
    Then I get a problem response with status code "404" and details:
      | Status Code | 404 |