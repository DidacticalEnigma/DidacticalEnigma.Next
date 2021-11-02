using System.Net;
using DidacticalEnigma.Core.Models.HighLevel;
using DidacticalEnigma.Core.Models.HighLevel.KanjiLookupService;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace DidacticalEnigma.RestApi.Controllers
{
    [Route("radicals")]
    public class RadicalsController : Controller
    {
        [HttpGet("list")]
        [SwaggerOperation(OperationId = "ListRadicals")]
        public ActionResult<ListRadicalsResult> ListRadicals(
            [FromServices] IKanjiLookupService lookupService)
        {
            var listedRadicalsOpt = lookupService.ListRadicals();
            
            return listedRadicalsOpt
                .Map(listedRadicals =>
                    (ActionResult<ListRadicalsResult>)this.Ok(listedRadicals))
                .ValueOr(error =>
                {
                    switch (error.Code)
                    {
                        default:
                            return this.StatusCode((int)HttpStatusCode.InternalServerError, error);
                    }
                });
        }

        [HttpGet("select")]
        [SwaggerOperation(OperationId = "SelectRadicals")]
        public ActionResult<KanjiLookupResult> SelectRadicals(
            [FromServices] IKanjiLookupService lookupService,
            [FromQuery(Name = "query")] string query,
            [FromQuery(Name = "sort")] string sort,
            [FromQuery(Name = "select")] string select = null,
            [FromQuery(Name = "deselect")] string deselect = null)
        {
            var selectedRadicalsOpt = lookupService.SelectRadicals(query, sort, @select, deselect);

            return selectedRadicalsOpt
                .Map(selectedRadicals =>
                    (ActionResult<KanjiLookupResult>)this.Ok(selectedRadicals))
                .ValueOr(error =>
                {
                    switch (error.Code)
                    {
                        case ErrorCodes.InvalidInput:
                            return this.BadRequest(error);
                        default:
                            return this.StatusCode((int)HttpStatusCode.InternalServerError, error);
                    }
                });
        }
    }
}
