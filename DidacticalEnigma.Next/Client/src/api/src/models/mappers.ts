import * as coreClient from "@azure/core-client";

export const AutoGlossResult: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "AutoGlossResult",
    modelProperties: {
      entries: {
        serializedName: "entries",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "AutoGlossEntry"
            }
          }
        }
      }
    }
  }
};

export const AutoGlossEntry: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "AutoGlossEntry",
    modelProperties: {
      word: {
        serializedName: "word",
        required: true,
        type: {
          name: "String"
        }
      },
      definitions: {
        serializedName: "definitions",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      }
    }
  }
};

export const DataSourceInformation: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "DataSourceInformation",
    modelProperties: {
      identifier: {
        serializedName: "identifier",
        required: true,
        type: {
          name: "String"
        }
      },
      friendlyName: {
        serializedName: "friendlyName",
        required: true,
        type: {
          name: "String"
        }
      }
    }
  }
};

export const DataSourceParseRequest: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "DataSourceParseRequest",
    modelProperties: {
      requestedDataSources: {
        serializedName: "requestedDataSources",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      text: {
        serializedName: "text",
        type: {
          name: "String"
        }
      },
      positions: {
        serializedName: "positions",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "DataSourceParseRequestPosition"
            }
          }
        }
      }
    }
  }
};

export const DataSourceParseRequestPosition: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "DataSourceParseRequestPosition",
    modelProperties: {
      position: {
        serializedName: "position",
        required: true,
        type: {
          name: "Number"
        }
      },
      positionEnd: {
        serializedName: "positionEnd",
        type: {
          name: "Number"
        }
      }
    }
  }
};

export const DataSourceParseResponse: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "DataSourceParseResponse",
    modelProperties: {
      position: {
        serializedName: "position",
        required: true,
        type: {
          name: "Number"
        }
      },
      positionEnd: {
        serializedName: "positionEnd",
        type: {
          name: "Number"
        }
      },
      dataSource: {
        serializedName: "dataSource",
        required: true,
        type: {
          name: "String"
        }
      },
      context: {
        serializedName: "context",
        type: {
          name: "String"
        }
      },
      error: {
        serializedName: "error",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const KanaResult: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "KanaResult",
    modelProperties: {
      hiragana: {
        serializedName: "hiragana",
        type: {
          name: "Composite",
          className: "KanaBoard"
        }
      },
      katakana: {
        serializedName: "katakana",
        type: {
          name: "Composite",
          className: "KanaBoard"
        }
      }
    }
  }
};

export const KanaBoard: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "KanaBoard",
    modelProperties: {
      width: {
        serializedName: "width",
        required: true,
        type: {
          name: "Number"
        }
      },
      height: {
        serializedName: "height",
        required: true,
        type: {
          name: "Number"
        }
      },
      layout: {
        defaultValue: "TopToBottomLeftToRight",
        isConstant: true,
        serializedName: "layout",
        type: {
          name: "String"
        }
      },
      characters: {
        serializedName: "characters",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "KanaCharacter"
            }
          }
        }
      }
    }
  }
};

export const KanaCharacter: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "KanaCharacter",
    modelProperties: {
      kana: {
        serializedName: "kana",
        required: true,
        type: {
          name: "String"
        }
      },
      romaji: {
        serializedName: "romaji",
        required: true,
        type: {
          name: "String"
        }
      }
    }
  }
};

export const ListRadicalsResult: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "ListRadicalsResult",
    modelProperties: {
      possibleRadicals: {
        serializedName: "possibleRadicals",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      radicalInformation: {
        serializedName: "radicalInformation",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "ExtendedRadicalInformation"
            }
          }
        }
      },
      sortingCriteria: {
        serializedName: "sortingCriteria",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      }
    }
  }
};

export const ExtendedRadicalInformation: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "ExtendedRadicalInformation",
    modelProperties: {
      radical: {
        serializedName: "radical",
        required: true,
        type: {
          name: "String"
        }
      },
      strokeCount: {
        serializedName: "strokeCount",
        required: true,
        type: {
          name: "Number"
        }
      },
      alternativeDisplay: {
        serializedName: "alternativeDisplay",
        required: true,
        type: {
          name: "String"
        }
      },
      queryNames: {
        serializedName: "queryNames",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      }
    }
  }
};

export const KanjiLookupResult: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "KanjiLookupResult",
    modelProperties: {
      newQuery: {
        serializedName: "newQuery",
        required: true,
        type: {
          name: "String"
        }
      },
      kanji: {
        serializedName: "kanji",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "String"
            }
          }
        }
      },
      radicals: {
        serializedName: "radicals",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "RadicalState"
            }
          }
        }
      }
    }
  }
};

export const RadicalState: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "RadicalState",
    modelProperties: {
      radical: {
        serializedName: "radical",
        required: true,
        type: {
          name: "String"
        }
      },
      isAvailable: {
        serializedName: "isAvailable",
        required: true,
        type: {
          name: "Boolean"
        }
      },
      isSelected: {
        serializedName: "isSelected",
        required: true,
        type: {
          name: "Boolean"
        }
      }
    }
  }
};

export const ProgramConfigurationGetResult: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "ProgramConfigurationGetResult",
    modelProperties: {
      isDefault: {
        serializedName: "isDefault",
        required: true,
        type: {
          name: "Boolean"
        }
      },
      aboutSection: {
        serializedName: "aboutSection",
        required: true,
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "version",
        required: true,
        type: {
          name: "String"
        }
      },
      dataSourceGridLayouts: {
        serializedName: "dataSourceGridLayouts",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "any"
            }
          }
        }
      }
    }
  }
};

export const ProgramConfigurationSetRequest: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "ProgramConfigurationSetRequest",
    modelProperties: {
      dataSourceGridLayouts: {
        serializedName: "dataSourceGridLayouts",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "any"
            }
          }
        }
      }
    }
  }
};

export const WordInfoResponse: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "WordInfoResponse",
    modelProperties: {
      wordInformation: {
        serializedName: "wordInformation",
        required: true,
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "WordInfo"
            }
          }
        }
      },
      similarLetters: {
        serializedName: "similarLetters",
        required: true,
        type: {
          name: "Dictionary",
          value: {
            type: {
              name: "Sequence",
              element: {
                type: { name: "Composite", className: "SimilarLetter" }
              }
            }
          }
        }
      }
    }
  }
};

export const WordInfo: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "WordInfo",
    modelProperties: {
      text: {
        serializedName: "text",
        required: true,
        type: {
          name: "String"
        }
      },
      dictionaryForm: {
        serializedName: "dictionaryForm",
        required: true,
        type: {
          name: "String"
        }
      },
      reading: {
        serializedName: "reading",
        required: true,
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        required: true,
        type: {
          name: "String"
        }
      }
    }
  }
};

export const SimilarLetter: coreClient.CompositeMapper = {
  type: {
    name: "Composite",
    className: "SimilarLetter",
    modelProperties: {
      letter: {
        serializedName: "letter",
        required: true,
        type: {
          name: "String"
        }
      },
      description: {
        serializedName: "description",
        required: true,
        type: {
          name: "String"
        }
      },
      category: {
        serializedName: "category",
        required: true,
        type: {
          name: "String"
        }
      }
    }
  }
};
