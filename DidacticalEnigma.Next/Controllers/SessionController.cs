using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using DidacticalEnigma.Core.Models.LanguageService;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Optional;
using Optional.Collections;
using Optional.Unsafe;
using Swashbuckle.AspNetCore.Annotations;

namespace DidacticalEnigma.Next.Controllers;

[ApiController]
[Route("session")]
public class SessionController : ControllerBase
{
    private readonly ILogger<SessionController> logger;
    private readonly ServiceConfiguration dataConfig;

    public SessionController(
        IOptions<ServiceConfiguration> dataConfig,
        ILogger<SessionController> logger)
    {
        this.logger = logger;
        this.dataConfig = dataConfig.Value;
    }

    [Authorize("AllowAnonymous")]
    [HttpGet]
    [SwaggerOperation(OperationId = "LoadSession")]
    public async Task<ActionResult<ProgramConfigurationGetResult>> LoadSession(
        [FromServices] DisclaimersGetter disclaimersGetter)
    {
        var layouts = new Element[3]
        {
            new Root()
            {
                Tree = new VSplit()
                {
                    First = new Leaf()
                    {
                        Identifier = "9eaf9b28-6abc-40b1-86d1-14967e0fa4da"
                    },
                    Second = new Leaf()
                    {
                        Identifier = "ed1b840c-b2a8-4018-87b0-d5fc64a1abc8"
                    }
                }
            },
            new Root()
            {
                Tree = new HSplit()
                {
                    First = new Leaf()
                    {
                        Identifier = "9eaf9b28-6abc-40b1-86d1-14967e0fa4da"
                    },
                    Second = new Leaf()
                    {
                        Identifier = "ed1b840c-b2a8-4018-87b0-d5fc64a1abc8"
                    }
                }
            },
            JsonSerializer.Deserialize<Element>(
                "{\"Tree\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"hsplit\",\"First\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"hsplit\",\"First\":{\"Content\":\"9eaf9b28-6abc-40b1-86d1-14967e0fa4da\",\"Type\":\"end\"},\"Second\":{\"Content\":\"e0b9d0e5-be75-4d1e-9f19-7795fd602836\",\"Type\":\"end\"},\"LeftDimension\":\"191.64923081038*\",\"RightDimension\":\"172.580748187074*\"},\"Second\":{\"Content\":\"0c0999f9-f361-46d3-8e24-ba3a7ca669e7|frequently-misunderstood-japanese-1\",\"Type\":\"end\"},\"LeftDimension\":\"184.378390256924*\",\"RightDimension\":\"174.870151839783*\"},\"Second\":{\"Content\":\"c04648ba-68b2-467b-87c4-33da5b9ca070\",\"Type\":\"end\"},\"LeftDimension\":\"364.248542096707*\",\"RightDimension\":\"499.251457903293*\"},\"Second\":{\"Type\":\"vsplit\",\"First\":{\"Content\":\"4c939423-463d-46e1-a8f4-685b1875fdfd\",\"Type\":\"end\"},\"Second\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"vsplit\",\"First\":{\"Content\":\"6ecf8f92-e97b-4d27-8bbf-1438e987c230\",\"Type\":\"end\"},\"Second\":{\"Content\":\"af65046c-35cb-4856-9774-943203e26979\",\"Type\":\"end\"},\"LeftDimension\":\"*\",\"RightDimension\":\"*\"},\"Second\":{\"Content\":\"4d25d667-d7fc-4f37-9ff5-364dfad46028\",\"Type\":\"end\"},\"LeftDimension\":\"422.745052770449*\",\"RightDimension\":\"188.745052770448*\"},\"LeftDimension\":\"238.009894459103*\",\"RightDimension\":\"616.490105540897*\"},\"LeftDimension\":\"369.229978997454*\",\"RightDimension\":\"290.425405617931*\"},\"Second\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"hsplit\",\"First\":{\"Content\":\"ed1b840c-b2a8-4018-87b0-d5fc64a1abc8\",\"Type\":\"end\"},\"Second\":{\"Content\":\"af9401b8-958e-4f31-8673-9b64c8a5f2cd\",\"Type\":\"end\"},\"LeftDimension\":\"529.686666666666*\",\"RightDimension\":\"187.686666666667*\"},\"Second\":{\"Content\":\"0c0999f9-f361-46d3-8e24-ba3a7ca669e7|wadai1\",\"Type\":\"end\"},\"LeftDimension\":\"572.606362076031*\",\"RightDimension\":\"458.893637923969*\"},\"LeftDimension\":\"868.5*\",\"RightDimension\":\"1036.5*\"},\"Type\":\"root\"}") ??
            throw new JsonException(),
        };
        var config = new ProgramConfigurationGetResult()
        {
            IsDefault = true,
            AboutSection = disclaimersGetter.GetDisclaimers(),
            Version = disclaimersGetter.GetVersion(),
            DataSourceGridLayouts = layouts
        };
        if (HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Anonymous))
        {
            return config;
        }

        layouts[0] = await LoadAtPath("view.config", layouts[0]);
        layouts[1] = await LoadAtPath("view_2.config", layouts[1]);
        layouts[2] = await LoadAtPath("view_3.config", layouts[2]);

        return config;
        
        async Task<Element> LoadAtPath(string configFileName, Element defaultValue)
        {
            try
            {
                await using var file = System.IO.File.OpenRead(Path.Combine(dataConfig.ConfigDirectory, configFileName));
                var result = await JsonSerializer.DeserializeAsync<Element>(file) ?? throw new JsonException("invalid data");
                config.IsDefault = false;
                return result;
            }
            catch (Exception e)
            {
                this.logger.LogError(e, "failed to load the file");
            }

            return defaultValue;
        }
    }

    [Authorize("RejectAnonymous")]
    [HttpPost]
    [SwaggerOperation(OperationId = "SaveSession")]
    public async Task<ActionResult> SaveSession(ProgramConfigurationSetRequest configuration)
    {
        await TryWrite("view.config", 0);
        await TryWrite("view_2.config", 1);
        await TryWrite("view_3.config", 2);

        async Task TryWrite(string configFilePath, int index)
        {
            var opt = configuration.DataSourceGridLayouts.ElementAtOrNone(index);
            if (opt.HasValue)
            {
                await using var file = System.IO.File.Create(Path.Combine(dataConfig.ConfigDirectory, configFilePath));
                await JsonSerializer.SerializeAsync(file, opt.ValueOrFailure());
            }
        }

        return Ok();
    }
}