<?php

namespace App\Modules\Mvp\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

class DebtController extends Controller
{

    /**
     * The Client.
     *
     * @var Client
     */
    protected $client;

    /**
     * Create a new DebtController instance.
     *
     * @return void
     */	
    public function __construct()
    {
        $this->client = new Client(
	    [
                'base_uri' => 'http://poga.base97.com/api/v1/',
		'headers' => [
                    'Content-Type' => 'application/json'
	        ]
	    ]
        );
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
	//$request->validate([
            //'debt.amount.currency' => 'required',
	    //'debt.amount.value' => 'required',
	//]);
	
	$response = $this->client->post('/debts', [
            'body' => [
                'debt' => [
                    'amount' => [
		        'currency' => $request->currency,
			'value' => $request->value,
		    ],
		    'description' => [
		        'summary' => $request->summary,
			'text' => $request->text
		    ],
		    'docId' => $request->doc_id,
		    'label' => $request->label,
		    'target' => [
                        'label' => $request->target_label,
			'number' => $request->target_number,
                        'type' => $request->target_type,
		    ],
		    'validPeriod' => [
                        'end' => $request->end,
			'start' => $request->start
		    ]
	        ]
	    ]
	]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
