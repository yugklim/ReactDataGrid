using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.Extensions;
using OpenQA.Selenium.Support.UI;

namespace ReactDataGridTests
{
    [TestFixture]
    public class OuterEvent: Base
    {
        [Test]
        public void Click_On_Goto2NdPage()
        {
            GoTo2NdPageButton.Click();
            TestPageNumber(2);
        }

        [Test]
        public void Does_NoData_Work_With_GridDefaultParameters()
        {
            Driver.ExecuteJavaScript("rdcTesting.renderDefault([{Header: 'Id', Field: 'Id'},{Header: 'Field0', Field: 'Field0', Sortable: false}, {Header: 'Field1', Field: 'Field1', Sortable: true}]);");
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.ElementExists(By.TagName("table")));
            Click_On_Goto2NdPage();
        }
    }
}
