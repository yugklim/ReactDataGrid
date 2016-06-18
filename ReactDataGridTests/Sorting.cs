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
    public class Sorting: Base
    {
        [Test]
        public void Sort_By_Field()
        {
            IWebElement firstCell = GridCell(0, 0);
            IWebElement secondCell = GridCell(0, 1);
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(firstCell, "99"));
            
            IdHeader.Click();
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(firstCell, "1"));

            Assert.AreEqual("1", firstCell.Text);

            Field0Header.Click();

            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(secondCell, "Item 99 Field0"));

            Assert.AreEqual("Item 99 Field0", secondCell.Text);
        }

        [Test]
        public void Test_Only_Id_Is_Sortable()
        {
            Driver.ExecuteJavaScript("rdcTesting.renderDefault([{Header: 'Id', Field: 'Id', Sortable: true},{Header: 'Field0', Field: 'Field0', Sortable: false}, {Header: 'Field1', Field: 'Field1'}]);");
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.ElementExists(By.TagName("table")));
            IWebElement firstCell = GridCell(0, 0);
            IWebElement secondCell = GridCell(0, 1);
            IWebElement thirdCell = GridCell(0, 2);

            IdHeader.Click();
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(firstCell, "1"));
            
            Assert.AreEqual("1", firstCell.Text);
            Assert.IsNull(Field0Header);
            Assert.IsNull(Field1Header);

            IdHeader.Click();
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(firstCell, "99"));

            Assert.AreEqual("99", firstCell.Text);
            Assert.IsNull(Field0Header);
            Assert.IsNull(Field1Header);
        }

        [Test]
        public void Test_Only_Field0_Is_Sortable()
        {
            Driver.ExecuteJavaScript("rdcTesting.renderDefault([{Header: 'Id', Field: 'Id', Sortable: false},{Header: 'Field0', Field: 'Field0', Sortable: true}, {Header: 'Field1', Field: 'Field1'}]);");
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.ElementExists(By.TagName("table")));
            IWebElement firstCell = GridCell(0, 0);
            IWebElement secondCell = GridCell(0, 1);
            IWebElement thirdCell = GridCell(0, 2);

            Field0Header.Click();
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(secondCell, "Item 1 Field0"));
            
            Assert.AreEqual("Item 1 Field0", secondCell.Text);
            Assert.IsNull(IdHeader);
            Assert.IsNull(Field1Header);

            Field0Header.Click();
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(secondCell, "Item 99 Field0"));

            Assert.AreEqual("Item 99 Field0", secondCell.Text);
            Assert.IsNull(IdHeader);
            Assert.IsNull(Field1Header);
        }

        [Test]
        public void Test_Only_Field1_Is_Sortable()
        {
            Driver.ExecuteJavaScript("rdcTesting.renderDefault([{Header: 'Id', Field: 'Id'},{Header: 'Field0', Field: 'Field0', Sortable: false}, {Header: 'Field1', Field: 'Field1', Sortable: true}]);");
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.ElementExists(By.TagName("table")));
            IWebElement thirdCell = GridCell(0, 2);

            Field1Header.Click();
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(thirdCell, "Item 1 Field1"));

            Assert.AreEqual("Item 1 Field1", thirdCell.Text);
            Assert.IsNull(IdHeader);
            Assert.IsNull(Field0Header);

            Field1Header.Click();
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.TextToBePresentInElement(thirdCell, "Item 99 Field1"));

            Assert.AreEqual("Item 99 Field1", thirdCell.Text);
            Assert.IsNull(IdHeader);
            Assert.IsNull(Field0Header);
        }
    }
}

