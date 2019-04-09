<?php

class FirstCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    // tests
    public function tryToTest(AcceptanceTester $I) {
      $I->amOnPage('/');
      $I->wait(1);
      $I->see('Studenter');
      $I->see('Rune Bergh');
      $I->maximizeWindow();
      $I->makeScreenshot();
    }
}
